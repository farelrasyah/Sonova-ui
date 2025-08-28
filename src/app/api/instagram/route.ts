import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AttemptLog = {
  providerUrl: string;
  triedIgUrl: string;
  status?: number;
  bodyText?: string | null;
  headers?: Record<string, string>;
  error?: string;
};

const PROVIDER_BASE = 'https://fastsaverapi.com';
const ENDPOINT_PATH = '/get-info';        // <-- sesuai dokumentasi
const TIMEOUT_MS = 12000;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get('url');

    if (!rawUrl) {
      console.error('[api/instagram] ❌ Missing url parameter');
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    const token = process.env.FASTSAVER_API_KEY;
    if (!token) {
      console.error('[api/instagram] ❌ FASTSAVER_API_KEY is not set in environment');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 1) Validasi & “bersihkan” URL Instagram
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      console.error('[api/instagram] ❌ Invalid URL format', { rawUrl });
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // izinkan instagram.com dan instagr.am (shortlink)
    if (!/(\.|^)instagram\.com$|(\.|^)instagr\.am$/i.test(parsed.hostname)) {
      console.error('[api/instagram] ❌ Not an instagram URL', { host: parsed.hostname });
      return NextResponse.json({ error: 'URL must be from instagram.com' }, { status: 400 });
    }

    // hapus query (?igsh=...) & fragment
    parsed.search = '';
    parsed.hash = '';

    const baseNoQuery = `${parsed.origin}${parsed.pathname}`;
    const igVariants = new Set<string>([baseNoQuery]);
    if (baseNoQuery.endsWith('/')) igVariants.add(baseNoQuery.slice(0, -1));
    else igVariants.add(baseNoQuery + '/');

    // helper fetch + logging
    async function fetchWithTimeout(url: string) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort('timeout'), TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          // NOTE: token harus lewat query param, tidak pakai Authorization header
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; NextJS-FastSaverProxy/1.0)',
          },
        });

        let bodyText: string | null = null;
        try {
          bodyText = await res.clone().text();
        } catch {
          bodyText = null;
        }

        const hdrs: Record<string, string> = {};
        try {
          res.headers.forEach((v, k) => (hdrs[k] = v));
        } catch {}

        return { res, bodyText, headers: hdrs };
      } finally {
        clearTimeout(id);
      }
    }

    const attempts: AttemptLog[] = [];

    // 2) Coba semua varian IG URL
    for (const igUrl of igVariants) {
      const sp = new URLSearchParams({ url: igUrl, token }); // <-- token sebagai query
      const providerUrl = `${PROVIDER_BASE}${ENDPOINT_PATH}?${sp.toString()}`;

      console.info('[api/instagram] → Calling provider', {
        endpoint: ENDPOINT_PATH,
        providerUrlWithoutToken: `${PROVIDER_BASE}${ENDPOINT_PATH}?url=${encodeURIComponent(igUrl)}&token=***`,
      });

      try {
        const out = await fetchWithTimeout(providerUrl);

        // log ringkas
        attempts.push({
          providerUrl: `${PROVIDER_BASE}${ENDPOINT_PATH}?url=${encodeURIComponent(igUrl)}&token=***`,
          triedIgUrl: igUrl,
          status: out.res.status,
          bodyText: truncate(out.bodyText, 2000),
          headers: out.headers,
        });

        // provider docs: 200 success, 422 validation error
        if (out.res.ok) {
          let payload: any = null;
          try {
            payload = JSON.parse(out.bodyText || 'null');
          } catch {
            // kalau bukan JSON valid, tetap kirim sebagai text
            return NextResponse.json(
              { rawText: out.bodyText, normalized: null, attempts },
              { status: 200 }
            );
          }

          const normalized = normalizeInstagram(payload);
          return NextResponse.json({ raw: payload, normalized, attempts }, { status: 200 });
        }

        if (out.res.status === 401) {
          console.error('[api/instagram] ❌ Unauthorized from provider (token salah/expired)');
          return NextResponse.json(
            { error: 'Unauthorized from provider. Check FASTSAVER_API_KEY.', attempts },
            { status: 502 }
          );
        }

        if (out.res.status === 422) {
          console.error('[api/instagram] ❌ Validation Error from provider (cek query url & token)');
          return NextResponse.json(
            {
              error:
                'Validation error from provider (422). Pastikan parameter "url" dan "token" benar serta konten IG publik.',
              attempts,
            },
            { status: 422 }
          );
        }

        // 429 (rate limit) – teruskan ke client
        if (out.res.status === 429) {
          console.warn('[api/instagram] ⚠️ Rate limited by provider');
          return NextResponse.json(
            { error: 'Rate limited by provider. Try again later.', attempts },
            { status: 429 }
          );
        }

        // 4xx/5xx lain → lanjut coba varian berikutnya
        console.warn('[api/instagram] Provider non-OK, trying next variant', {
          status: out.res.status,
        });
      } catch (err: any) {
        attempts.push({
          providerUrl: `${PROVIDER_BASE}${ENDPOINT_PATH}?url=${encodeURIComponent(igUrl)}&token=***`,
          triedIgUrl: igUrl,
          error: String(err?.message || err),
        });
        console.error('[api/instagram] ❌ Fetch error to provider', {
          tried: igUrl,
          error: String(err?.message || err),
        });
      }
    }

    // Semua percobaan gagal
    console.error('[api/instagram] ❌ All attempts failed', { attempts });
    // pilih status paling informatif
    const statusFromAttempts =
      attempts.find(a => a.status && a.status >= 400 && a.status !== 404)?.status ||
      attempts.find(a => a.status)?.status ||
      502;

    return NextResponse.json(
      {
        error:
          statusFromAttempts === 404
            ? 'Media not found. Pastikan URL IG publik & benar.'
            : 'Provider error',
        attempts,
      },
      { status: statusFromAttempts }
    );
  } catch (err) {
    console.error('[api/instagram] ❌ Unexpected error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

/** Utils */

function truncate(s: string | null, n: number) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n) + '…(truncated)' : s;
}

/**
 * Normalisasi struktur respons provider menjadi format mudah pakai di frontend.
 * Mengkover kemungkinan field berbeda (media/medias/items/links/result/data).
 */
function normalizeInstagram(data: any) {
  const items: Array<{ type: 'video' | 'image'; url: string; thumbnail?: string | null; quality?: any }> = [];
  if (!data) return { title: null, items };

  // kumpulkan array kandidat
  const pools = []
    .concat(data?.media ?? [])
    .concat(data?.medias ?? [])
    .concat(data?.items ?? [])
    .concat(data?.links ?? [])
    .concat(data?.result ?? [])
    .concat(data?.results ?? [])
    .concat(data?.data ?? []);

  let list: any[] = Array.isArray(pools) && pools.length ? pools : [];
  if (!list.length) {
    if (Array.isArray(data)) list = data;
    else if (data.url || data.video || data.image || data.download_url) list = [data];
  }

  for (const it of list) {
    const isVideo = Boolean(it?.type === 'video' || it?.is_video || it?.video || it?.videoUrl || it?.play);
    const type: 'video' | 'image' = isVideo ? 'video' : 'image';

    const url =
      it?.download_url ||
      it?.url ||
      it?.videoUrl ||
      it?.play ||
      it?.src ||
      it?.link ||
      it?.media?.url ||
      it?.media?.video ||
      it?.media?.image;

    const thumbnail =
      it?.thumbnail || it?.thumb || it?.cover || it?.cover_url || it?.image || it?.imageUrl || null;

    const quality = it?.quality || it?.q || it?.resolution || null;

    if (url) items.push({ type, url, thumbnail, quality });
  }

  const title = data?.title || data?.caption || data?.description || data?.meta?.title || null;
  return { title, items };
}
