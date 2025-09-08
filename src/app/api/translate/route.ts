import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sections, target } = body;
    if (!sections || !target) {
      return NextResponse.json({ error: 'Missing sections or target language' }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional translator and academic editor. Translate the following JSON bundle into ${target}. The input has keys: brief, detailed, keyPoints; each value is an object with keys: title, intro, paragraphs (array), points (array), conclusion. Return ONLY valid JSON with the same top-level keys (brief,detailed,keyPoints) and translated sub-objects. Do not include any commentary or extra text. Ensure the translated text is formal and appropriate for an academic paper.\n\nINPUT_JSON:\n${JSON.stringify(sections)}`;

    // Use the same generateContent pattern used elsewhere in the project
    const response = await model.generateContent(prompt);

    // Try to extract text content from response
    let aiText = '';
    try {
      if (response?.response && typeof response.response.text === 'function') {
        aiText = response.response.text();
      } else {
        aiText = JSON.stringify(response);
      }
    } catch (_e) {
      aiText = JSON.stringify(response);
    }

    // find JSON substring and parse
    let parsed: any = null;
    try {
      const m = aiText.match(/\{[\s\S]*\}/m);
      if (m) parsed = JSON.parse(m[0]);
    } catch (_e) {
      parsed = null;
    }

    if (!parsed) {
      console.error('Translate API parse failed, aiText:', aiText);
      return NextResponse.json({ error: 'translation_failed', raw: aiText }, { status: 502 });
    }

    // Basic validation: expect keys brief/detailed/keyPoints
    if (!parsed.brief && !parsed.detailed && !parsed.keyPoints) {
      // If model returned a single section, wrap it for all tabs
      return NextResponse.json({ translated: { brief: parsed, detailed: parsed, keyPoints: parsed } });
    }

    return NextResponse.json({ translated: parsed });
  } catch (err) {
    console.error('Translate API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
