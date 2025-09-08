'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaCopy, FaEdit, FaSave, FaUndo } from 'react-icons/fa';

interface SummaryDisplayProps {
  summaries: {
    brief: string;
    detailed: string;
    keyPoints: string;
  };
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summaries }) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'detailed' | 'keyPoints'>('brief');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [originalContent, setOriginalContent] = useState('');
  const [currentSummaries, setCurrentSummaries] = useState<{ brief: string; detailed: string; keyPoints: string }>({
    brief: summaries.brief || '',
    detailed: summaries.detailed || '',
    keyPoints: summaries.keyPoints || ''
  });
  const summariesKeyRef = useRef<string>('');

  const computeSummariesKey = (obj: { brief?: string; detailed?: string; keyPoints?: string }) => {
    const s = `${obj.brief || ''}||${obj.detailed || ''}||${obj.keyPoints || ''}`;
    // simple non-crypto hash to keep key short
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return 'k_' + (h >>> 0).toString(16);
  };
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };
  const [targetLang, setTargetLang] = useState('id'); // default Indonesian
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [translating, setTranslating] = useState(false);

  const tabs = [
  { key: 'brief', label: 'Ringkasan Singkat', icon: '📝', content: currentSummaries.brief },
  { key: 'detailed', label: 'Ringkasan Detail', icon: '📖', content: currentSummaries.detailed },
  { key: 'keyPoints', label: 'Poin Penting', icon: '🎯', content: currentSummaries.keyPoints }
  ];

  const getCurrentContent = () => {
    if (editMode) return editedContent;
    return tabs.find(tab => tab.key === activeTab)?.content || '';
  };

  // Sanitize text for display (remove common markdown characters that may clutter view)
  const sanitizeForDisplay = (text: string) => {
    if (!text) return '';
    // remove code fences and inline code
    let out = String(text)
      .replace(/```[\s\S]*?```/g, '') // remove code blocks
      .replace(/`+/g, '')
      // remove images entirely
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      // preserve link text, drop URL: [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // remove common markdown emphasis markers but keep content
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // remove remaining stray asterisks, tildes, backslashes
      .replace(/[\*~\\]+/g, '')
      // normalize Windows newlines
      .replace(/\r\n/g, '\n');

    // Clean up each line: drop leading list markers or heading hashes
    out = out
      .split('\n')
      .map(line => line.replace(/^\s*[\-\*+\u2022\•]+\s*/, '').replace(/^\s*#{1,6}\s*/, ''))
      .join('\n')
      .replace(/\s{2,}/g, ' ')
      .trim();

    return out;
  };

  const handleEdit = () => {
    // Build the full displayed content (title + intro + paragraphs + points + conclusion)
    const translated = translations[targetLang];
    const baseMap: any = {
      brief: buildPaperSections(currentSummaries.brief || ''),
      detailed: buildPaperSections(currentSummaries.detailed || ''),
      keyPoints: buildPaperSections(currentSummaries.keyPoints || '')
    };
    const sections = (translated && translated[activeTab]) ? translated[activeTab] : baseMap[activeTab];

    const fullTextParts: string[] = [];
    if (sections.title) fullTextParts.push(sections.title.trim());
    if (sections.intro) fullTextParts.push(sections.intro.trim());
    if (sections.paragraphs && sections.paragraphs.length) fullTextParts.push(...sections.paragraphs.map((p: string) => p.trim()));
    if (sections.points && sections.points.length) fullTextParts.push('Poin Penting: ' + sections.points.map((pt: string) => '- ' + pt.trim()).join('\n'));
    if (sections.conclusion) fullTextParts.push(sections.conclusion.trim());

    const currentContent = sanitizeForDisplay(fullTextParts.join('\n\n'));
    setOriginalContent(currentContent);
    setEditedContent(currentContent);
    setEditMode(true);
    // build structured HTML and populate editor
    setTimeout(() => {
      if (editorRef.current) {
        const sectionsHtml = sectionsToHtml(sections);
        editorRef.current.innerHTML = sectionsHtml;
      }
    }, 0);
  };

  // Convert sections object into structured HTML for editor
  const sectionsToHtml = (s: any) => {
    if (!s) return '';
    const parts: string[] = [];
    if (s.title) parts.push(`<h1 style="text-align:center;margin-bottom:0.5rem">${escapeHtml(s.title)}</h1>`);
    if (s.intro) parts.push(`<h2 style="text-align:left;margin-top:1rem;margin-bottom:0.25rem;font-weight:600">${escapeHtml(targetLang === 'en' ? 'Introduction' : 'Pendahuluan')}</h2><p style="text-align:justify;margin-top:0.25rem">${escapeHtml(s.intro)}</p>`);
    if (s.paragraphs && s.paragraphs.length) {
      parts.push(`<h2 style="text-align:left;margin-top:1rem;margin-bottom:0.25rem;font-weight:600">${escapeHtml(targetLang === 'en' ? 'Discussion' : 'Pembahasan')}</h2>`);
      s.paragraphs.forEach((p: string) => {
        parts.push(`<p style="text-align:justify;margin-top:0.75rem">${escapeHtml(p)}</p>`);
      });
    }
    if (s.points && s.points.length) {
      parts.push(`<h3 style="text-align:left;margin-top:1rem;margin-bottom:0.25rem;font-weight:600">${escapeHtml(targetLang === 'en' ? 'Key Points' : 'Poin Penting')}</h3><ul style="margin-left:1rem">` + s.points.map((pt: string) => `<li style="text-align:justify;margin-bottom:0.25rem">${escapeHtml(pt)}</li>`).join('') + `</ul>`);
    }
    if (s.conclusion) parts.push(`<h2 style="text-align:left;margin-top:1rem;margin-bottom:0.25rem;font-weight:600">${escapeHtml(targetLang === 'en' ? 'Conclusion' : 'Kesimpulan')}</h2><p style="text-align:justify;margin-top:0.25rem">${escapeHtml(s.conclusion)}</p>`);
    return parts.join('');
  };

  const escapeHtml = (str: string) => String(str).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'} as Record<string,string>)[c]);

  const handleSave = () => {
    // Read editor content, sanitize, update currentSummaries, persist entire summaries object
  // Prefer editor innerText for storage (clean text), but keep HTML for display in editor
  const rawText = editorRef.current ? editorRef.current.innerText : editedContent;
  const cleaned = sanitizeForDisplay(String(rawText));

  const updated = { ...currentSummaries };
  if (activeTab === 'brief') updated.brief = cleaned;
  if (activeTab === 'detailed') updated.detailed = cleaned;
  if (activeTab === 'keyPoints') updated.keyPoints = cleaned;

  setCurrentSummaries(updated);

    try {
  const k = summariesKeyRef.current || computeSummariesKey(summaries);
  localStorage.setItem('sonova_saved_summaries_' + k, JSON.stringify(updated));
    } catch (e) {
      // ignore storage errors
    }

    setEditMode(false);
    // clear translation cache so translated views refresh
    setTranslations({});
  showToast('Rangkuman berhasil diperbarui');
  };

  const handleCancel = () => {
    setEditedContent(originalContent);
    if (editorRef.current) editorRef.current.innerText = originalContent;
    setEditMode(false);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sonova_lang');
      if (saved) setTargetLang(saved);
      // load saved summaries if present
      // compute per-video key and load from that key
      const k = computeSummariesKey(summaries);
      summariesKeyRef.current = k;
      const savedSummariesRaw = localStorage.getItem('sonova_saved_summaries_' + k);
      if (savedSummariesRaw) {
        const savedSummaries = JSON.parse(savedSummariesRaw || '{}');
        setCurrentSummaries(prev => ({
          brief: savedSummaries.brief ?? prev.brief,
          detailed: savedSummaries.detailed ?? prev.detailed,
          keyPoints: savedSummaries.keyPoints ?? prev.keyPoints
        }));
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('sonova_lang', targetLang); } catch (e) { }
  }, [targetLang]);

  // Keep currentSummaries in sync if the incoming summaries prop updates and there's no saved override
  useEffect(() => {
    try {
      // recompute key for incoming summaries and load overrides for this video if any
      const k = computeSummariesKey(summaries);
      summariesKeyRef.current = k;
      const savedRaw = localStorage.getItem('sonova_saved_summaries_' + k);
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      setCurrentSummaries(prev => ({
        brief: saved.brief ?? summaries.brief ?? prev.brief,
        detailed: saved.detailed ?? summaries.detailed ?? prev.detailed,
        keyPoints: saved.keyPoints ?? summaries.keyPoints ?? prev.keyPoints
      }));
    } catch (e) {
      // ignore
    }
  }, [summaries.brief, summaries.detailed, summaries.keyPoints]);

  const availableLangs = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' }
  ];

  const requestTranslation = async (lang: string, force = false) => {
    if (!lang) return null;
    // don't re-request if cached and not forced
    if (!force && translations[lang]) return translations[lang];
    setTranslating(true);
    showToast('Translating...');
    try {
      // Build sections bundle for all three tabs so server can translate each independently
      const bundle = {
        brief: buildPaperSections(currentSummaries.brief || ''),
        detailed: buildPaperSections(currentSummaries.detailed || ''),
        keyPoints: buildPaperSections(currentSummaries.keyPoints || '')
      };

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: bundle, target: lang })
      });
      const data = await res.json();
      if (data?.translated) {
        // expect translated to be an object with brief/detailed/keyPoints
        setTranslations(prev => ({ ...prev, [lang]: data.translated }));
        setTranslating(false);
        showToast('Terjemahan selesai');
        return data.translated;
      }
      console.error('translation response missing translated', data);
      showToast('Gagal menerjemahkan');
    } catch (e) {
      console.error('translation error', e);
      showToast('Gagal menerjemahkan');
    }
    setTranslating(false);
    return null;
  };

  // Auto-request translation when language changes or content changes
  useEffect(() => {
    // If editing, skip translation requests until saved
    if (editMode) return;
    // If user selected default 'id' but original may already be in Indonesian, still safe to request once
    requestTranslation(targetLang).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang, currentSummaries.brief, currentSummaries.detailed, currentSummaries.keyPoints, activeTab]);

  const buildPaperTextFromSections = (s: any) => {
    if (!s) return '';
    let out = '';
    out += (s.title || '') + '\n\n';
    out += (targetLang === 'en' ? 'Introduction\n' : 'Pendahuluan\n') + (s.intro || '') + '\n\n';
    out += (targetLang === 'en' ? 'Discussion\n' : 'Pembahasan\n');
    (s.paragraphs || []).forEach((p: string) => { out += p.trim() + '\n\n'; });
    if (s.points && s.points.length) {
      out += (targetLang === 'en' ? 'Key Points\n' : 'Poin Penting\n');
      s.points.forEach((pt: string) => { out += '- ' + pt + '\n'; });
      out += '\n';
    }
    out += (targetLang === 'en' ? 'Conclusion\n' : 'Kesimpulan\n') + (s.conclusion || '') + '\n';
    return out.trim();
  };

  const handleCopy = async () => {
    try {
      // Copy the formatted paper text when not editing, otherwise copy edited content
  let contentToCopy = '';
  if (editMode) contentToCopy = editorRef.current ? editorRef.current.innerText : editedContent;
  else if (translations[targetLang]) contentToCopy = buildPaperTextFromSections(translations[targetLang]);
  else contentToCopy = buildPaperText(getCurrentContent());
      await navigator.clipboard.writeText(contentToCopy);
      setCopySuccess(true);
      showToast('Teks disalin ke clipboard');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast('Gagal menyalin teks');
    }
  };

  // Editor toolbar commands using document.execCommand fallback
  const applyCommand = (cmd: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    try {
      // use execCommand for basic formatting
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.execCommand(cmd, false, value);
      // sync editedContent
      setEditedContent(editorRef.current.innerHTML || editorRef.current.innerText);
    } catch (e) {
      console.warn('Formatting command failed', e);
    }
  };

  const handleInsertLink = () => {
    const url = window.prompt('Masukkan URL (https://...)');
    if (url) applyCommand('createLink', url);
  };

  const exportAsTxt = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportAsDoc = (html: string) => {
    // Basic Word export using HTML blob
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>";
    const footer = '</html>';
    const source = header + '<body>' + html + '</body>' + footer;
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.doc';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportAsPdf = (html: string) => {
    // Open printable window
    const w = window.open('', '_blank');
    if (!w) { showToast('Popup blocked'); return; }
    w.document.write('<html><head><title>Print Summary</title></head><body>' + html + '</body></html>');
    w.document.close();
    w.focus();
    // Give it a moment to render
    setTimeout(() => { w.print(); }, 500);
  };

  // Build structured paper sections from raw content and summaries
  const buildPaperSections = (raw: string) => {
  // Use currentSummaries (latest saved/edited) as the source of truth to avoid duplication
  const brief = sanitizeForDisplay(currentSummaries.brief || '');
  // Avoid using the same text for both brief and detailed (prevents duplicate intro+paragraphs)
  const detailed = sanitizeForDisplay((raw && raw !== currentSummaries.brief) ? raw : (currentSummaries.detailed || ''));
  const keyPoints = sanitizeForDisplay(currentSummaries.keyPoints || '');

    const titleCandidate = (brief.split('\n')[0] || detailed.split('\n')[0] || '').trim();
    const title = titleCandidate || 'Ringkasan Video';

    const intro = brief.trim() || extractFirstNSentences(detailed, 2);

    // Split detailed into paragraphs by double newline, or chunk sentences
      const rawParagraphs = detailed.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      // If paragraphs are very long, further split by sentences into chunks
      const paragraphs: string[] = [];
      const paragraphMaxChars = 600; // heuristic: split paragraphs longer than this
      const paragraphMaxSentences = 6; // or split if more than this many sentences
      const pushChunked = (text: string) => {
        const sents = sentenceSplit(text).map(s => s.trim()).filter(Boolean);
        if (sents.length === 0) return;
        if (sents.length <= paragraphMaxSentences && text.length <= paragraphMaxChars) {
          paragraphs.push(text.trim());
          return;
        }
        // chunk into groups of 2-3 sentences per paragraph ensuring reasonable length
        let chunkSize = 3;
        if (sents.length <= 8) chunkSize = 2;
        for (let i = 0; i < sents.length; i += chunkSize) {
          paragraphs.push(sents.slice(i, i + chunkSize).join(' ').trim());
        }
      };

      if (rawParagraphs.length) {
        rawParagraphs.forEach(p => pushChunked(p));
      } else {
        pushChunked(detailed);
      }

    const points = keyPoints
      .split(/\r?\n|;|\u2022|\u2023|\*|\-|•|\u2024|\u00B7/)
      .map(s => s.replace(/^[\s\-\*\u2022\•\u2023\u2024\u00B7]+/, '').replace(/[\*_`~]+/g, '').trim())
      .filter(Boolean);

    let conclusion = extractLastNSentences(detailed, 2) || (points.length ? points.slice(0,3).join('. ') + '.' : 'Kesimpulan: poin-poin utama tercantum di atas.');
    // If conclusion is long, split into multiple short paragraphs
    if (conclusion.length > paragraphMaxChars) {
      const consSents = sentenceSplit(conclusion).map(s => s.trim()).filter(Boolean);
      conclusion = consSents.slice(-4).join(' ');
    }

  return { title, intro, paragraphs, points, conclusion };
  };

  const buildPaperText = (raw: string) => {
    const s = buildPaperSections(raw);
    let out = '';
    out += s.title + '\n\n';
    out += 'Pendahuluan\n' + s.intro + '\n\n';
    out += 'Pembahasan\n';
    s.paragraphs.forEach((p: string) => {
      out += p.trim() + '\n\n';
    });
    if (s.points.length) {
      out += 'Poin Penting\n';
      s.points.forEach((pt: string) => {
        out += '- ' + pt + '\n';
      });
      out += '\n';
    }
    out += 'Kesimpulan\n' + s.conclusion + '\n';
    return out.trim();
  };

  // small helpers
  const sentenceSplit = (text: string) => text.match(/[^.!?]+[.!?]?/g) || [text];
  const extractFirstNSentences = (text: string, n: number) => sentenceSplit(text).slice(0,n).join(' ').trim();
  const extractLastNSentences = (text: string, n: number) => {
    const arr = sentenceSplit(text);
    return arr.slice(-n).join(' ').trim();
  };
  const chunkSentences = (text: string, per = 3) => {
    const sents = sentenceSplit(text).map(s => s.trim()).filter(Boolean);
    const chunks: string[] = [];
    for (let i=0;i<sents.length;i+=per){
      chunks.push(sents.slice(i,i+per).join(' '));
    }
    return chunks.length ? chunks : [text];
  };

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-indigo-50/50 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="mt-1">
                  <h2 className="text-lg lg:text-xl font-serif font-semibold text-white">Ringkasan Profesional</h2>
                  <p className="text-violet-100 text-xs mt-0.5">Diterjemahkan & disusun dengan Profesional</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl p-1">
                <label htmlFor="lang-select" className="sr-only">Language</label>
                <select
                  id="lang-select"
                  value={targetLang}
                  onChange={async (e) => {
                    const lang = e.target.value;
                    setTargetLang(lang);
                    // force a new translation request so UI updates
                    await requestTranslation(lang, true);
                  }}
                  className="bg-transparent text-white text-sm px-2 py-1 rounded-md focus:outline-none"
                  disabled={translating}
                  aria-label="Pilih bahasa"
                >
                  {availableLangs.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
                {translating && <div className="text-xs text-white/80 ml-2">Translating…</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="flex gap-2 bg-gray-100/50 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setEditMode(false);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-white shadow-lg text-violet-600 transform scale-[1.02]'
                    : 'text-gray-600 hover:text-violet-600 hover:bg-white/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="relative">
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                {!editMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaEdit className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        copySuccess
                          ? 'bg-green-500 text-white'
                          : 'bg-violet-500 hover:bg-violet-600 text-white'
                      }`}
                    >
                      <FaCopy className="w-3 h-3" />
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaSave className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <FaUndo className="w-3 h-3" />
                      Cancel
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          const text = editorRef.current ? (editorRef.current.innerText || editorRef.current.innerHTML) : editedContent;
                          exportAsTxt(String(text));
                        }}
                        className="ml-2 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                      >Export TXT</button>
                      <button
                        type="button"
                        onClick={() => {
                          const html = editorRef.current ? editorRef.current.innerHTML : editedContent;
                          exportAsDoc(String(html));
                        }}
                        className="ml-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
                      >Export DOC</button>
                      <button
                        type="button"
                        onClick={() => {
                          const html = editorRef.current ? editorRef.current.innerHTML : editedContent;
                          exportAsPdf(String(html));
                        }}
                        className="ml-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm"
                      >Print / PDF</button>
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                {getCurrentContent().length} characters
              </div>
            </div>

            {/* Content Display */}
            <div className={`transition-all duration-500 ${isExpanded ? 'max-h-[none]' : 'max-h-96'}`}>
              {editMode ? (
                <div className="relative">
                  {/* Toolbar */}
                  <div className="flex gap-2 mb-3">
                    <button type="button" onClick={() => applyCommand('bold')} className="px-3 py-1 bg-white rounded-md shadow-sm">B</button>
                    <button type="button" onClick={() => applyCommand('italic')} className="px-3 py-1 bg-white rounded-md shadow-sm">I</button>
                    <button type="button" onClick={() => applyCommand('underline')} className="px-3 py-1 bg-white rounded-md shadow-sm">U</button>
                    <button type="button" onClick={() => applyCommand('insertUnorderedList')} className="px-3 py-1 bg-white rounded-md shadow-sm">• List</button>
                    <button type="button" onClick={() => applyCommand('insertOrderedList')} className="px-3 py-1 bg-white rounded-md shadow-sm">1. List</button>
                    <button type="button" onClick={handleInsertLink} className="px-3 py-1 bg-white rounded-md shadow-sm">Link</button>
                    <button type="button" onClick={() => applyCommand('undo')} className="px-3 py-1 bg-white rounded-md shadow-sm">Undo</button>
                    <button type="button" onClick={() => applyCommand('redo')} className="px-3 py-1 bg-white rounded-md shadow-sm">Redo</button>
                  </div>

                  <div className="bg-gradient-to-br from-white to-violet-50/30 rounded-2xl p-0 shadow-inner border border-violet-100/50">
                    <div className="max-h-96 overflow-y-auto p-6">
                      <div
                        ref={editorRef}
                        contentEditable
                        role="textbox"
                        aria-multiline
                        onInput={() => setEditedContent(editorRef.current ? editorRef.current.innerHTML : '')}
                        className="w-full min-h-[10rem] whitespace-pre-wrap p-0 text-gray-800 leading-relaxed outline-none"
                        style={{ whiteSpace: 'pre-wrap' }}
                      />
                    </div>
                  </div>  
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-violet-50/30 rounded-2xl p-0 shadow-inner border border-violet-100/50">
                  <div className="max-h-96 overflow-y-auto p-6">
                    {/* Structured paper view */}
                    {(() => {
                      const translated = translations[targetLang];
                      // Choose the correct source based on active tab
                      const baseMap: any = {
                        brief: buildPaperSections(currentSummaries.brief || ''),
                        detailed: buildPaperSections(currentSummaries.detailed || ''),
                        keyPoints: buildPaperSections(currentSummaries.keyPoints || '')
                      };
                      const sections = (translated && translated[activeTab]) ? translated[activeTab] : baseMap[activeTab];

                      return (
                        <article className="max-w-none">
                          <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 text-center mb-4">{sections.title}</h1>

                          <h2 className="mt-4 text-lg font-semibold text-slate-700 text-left">{translated ? (sections.title ? (targetLang === 'en' ? 'Introduction' : 'Pendahuluan') : 'Pendahuluan') : 'Pendahuluan'}</h2>
                          <p className="text-slate-700 leading-relaxed mt-2" style={{ textAlign: 'justify' }}>{sections.intro}</p>

                          <h2 className="mt-6 text-lg font-semibold text-slate-700 text-left">{translated ? (targetLang === 'en' ? 'Discussion' : 'Pembahasan') : 'Pembahasan'}</h2>
                          {sections.paragraphs && sections.paragraphs.map((p: string, idx: number) => (
                            <section key={idx} className="mt-4">
                              <p className="text-slate-700 leading-relaxed" style={{ textAlign: 'justify' }}>{p}</p>
                            </section>
                          ))}

                          {sections.points && sections.points.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-md font-semibold text-slate-700 text-left">{translated ? (targetLang === 'en' ? 'Key Points' : 'Poin Penting') : 'Poin Penting'}</h3>
                              <ul className="list-disc list-inside mt-2 text-slate-700 text-left">
                                {sections.points.map((pt: string, i: number) => (
                                  <li key={i} className="mb-1">{pt}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <h2 className="mt-6 text-lg font-semibold text-slate-700 text-left">{translated ? (targetLang === 'en' ? 'Conclusion' : 'Kesimpulan') : 'Kesimpulan'}</h2>
                          <p className="text-slate-700 leading-relaxed mt-2" style={{ textAlign: 'justify' }}>{sections.conclusion}</p>
                        </article>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {!isExpanded && !editMode && getCurrentContent().length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Generated Summary</span>
            </div>
            <div className="text-xs">
              Generated at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed right-6 bottom-6 z-50">
            <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">{toast}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryDisplay;
