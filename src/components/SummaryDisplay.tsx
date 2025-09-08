'use client';

import React, { useState, useEffect } from 'react';
import { FaCopy, FaEdit, FaSave, FaUndo, FaExpand, FaCompress } from 'react-icons/fa';

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
  const [originalContent, setOriginalContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const [targetLang, setTargetLang] = useState('id'); // default Indonesian
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [translating, setTranslating] = useState(false);

  const tabs = [
    { key: 'brief', label: 'Ringkasan Singkat', icon: '📝', content: summaries.brief },
    { key: 'detailed', label: 'Ringkasan Detail', icon: '📖', content: summaries.detailed },
    { key: 'keyPoints', label: 'Poin Penting', icon: '🎯', content: summaries.keyPoints }
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
    const currentContent = tabs.find(tab => tab.key === activeTab)?.content || '';
    setOriginalContent(currentContent);
    setEditedContent(currentContent);
    setEditMode(true);
  };

  const handleSave = () => {
    // Update the summary content (you might want to save this to state management or backend)
    const tabIndex = tabs.findIndex(tab => tab.key === activeTab);
    if (tabIndex !== -1) {
      tabs[tabIndex].content = editedContent;
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedContent(originalContent);
    setEditMode(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sonova_lang');
      if (saved) setTargetLang(saved);
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('sonova_lang', targetLang); } catch (e) { }
  }, [targetLang]);

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
      const sections = buildPaperSections(getCurrentContent());
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections, target: lang })
      });
      const data = await res.json();
      if (data?.translated) {
        setTranslations(prev => ({ ...prev, [lang]: data.translated }));
        setTranslating(false);
        showToast('Terjemahan selesai');
        return data.translated;
      }
      // API returned no translated object
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
  }, [targetLang, summaries.brief, summaries.detailed, summaries.keyPoints, activeTab]);

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
  if (editMode) contentToCopy = editedContent;
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

  // Build structured paper sections from raw content and summaries
  const buildPaperSections = (raw: string) => {
  const brief = sanitizeForDisplay(summaries.brief || '');
  const detailed = sanitizeForDisplay(raw || summaries.detailed || '');
  const keyPoints = sanitizeForDisplay(summaries.keyPoints || '');

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
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Summary</h2>
                <p className="text-violet-100 text-sm">Powered by Google Gemini 1.5 Flash</p>
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

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 text-white"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
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
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-64 p-6 border-2 border-violet-200 rounded-2xl focus:border-violet-400 focus:outline-none resize-none bg-gradient-to-br from-white to-violet-50/30 text-gray-800 leading-relaxed shadow-inner"
                    placeholder="Edit your summary here..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    Click Save to keep changes
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-violet-50/30 rounded-2xl p-0 shadow-inner border border-violet-100/50">
                  <div className="max-h-96 overflow-y-auto p-6">
                    {/* Structured paper view */}
                    {(() => {
                      const baseSections = buildPaperSections(getCurrentContent());
                      const translated = translations[targetLang];
                      const sections = translated || baseSections;

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

            {!isExpanded && getCurrentContent().length > 500 && (
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
