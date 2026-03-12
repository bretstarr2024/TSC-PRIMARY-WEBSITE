'use client';

import { useState } from 'react';

type ContentType = 'blog' | 'news';
type Stage = 'input' | 'generating' | 'preview' | 'publishing' | 'done';

export default function WriteFromUrlPage() {
  const [url, setUrl] = useState('');
  const [contentType, setContentType] = useState<ContentType>('news');
  const [stage, setStage] = useState<Stage>('input');
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState<Record<string, unknown> | null>(null);
  const [meta, setMeta] = useState<{ sourceUrl: string; sourceName: string; sourceTitle: string } | null>(null);
  const [publishedUrl, setPublishedUrl] = useState('');

  async function handleGenerate() {
    if (!url.trim()) return;
    setStage('generating');
    setError('');
    try {
      const res = await fetch('/api/dashboard/generate-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), contentType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setGenerated(data.generated);
      setMeta({ sourceUrl: data.sourceUrl, sourceName: data.sourceName, sourceTitle: data.sourceTitle });
      setStage('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
      setStage('input');
    }
  }

  async function handlePublish() {
    if (!generated || !meta) return;
    setStage('publishing');
    setError('');
    try {
      const res = await fetch('/api/dashboard/publish-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, generated, sourceUrl: meta.sourceUrl, sourceName: meta.sourceName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Publish failed');
      setPublishedUrl(data.url);
      setStage('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
      setStage('preview');
    }
  }

  function reset() {
    setUrl('');
    setGenerated(null);
    setMeta(null);
    setPublishedUrl('');
    setError('');
    setStage('input');
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white">Write from URL</h1>
        <p className="text-sm text-[#6D6D69] mt-1">Paste any article URL — we'll generate a TSC-branded piece ready to publish.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-400">{error}</div>
      )}

      {stage === 'done' && (
        <div className="rounded-xl border border-[#E1FF00]/30 bg-[#E1FF00]/5 p-6 mb-6">
          <p className="text-[#E1FF00] font-medium mb-2">Published successfully</p>
          <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#73F5FF] hover:text-white transition-colors">
            View post → {publishedUrl}
          </a>
          <div className="mt-4">
            <button onClick={reset} className="text-xs text-[#6D6D69] hover:text-white transition-colors">
              Write another
            </button>
          </div>
        </div>
      )}

      {(stage === 'input' || stage === 'generating') && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] block mb-2">Article URL</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="https://..."
              disabled={stage === 'generating'}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#6D6D69] focus:outline-none focus:border-[#E1FF00]/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] block mb-2">Content Type</label>
            <div className="flex gap-3">
              {(['news', 'blog'] as ContentType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setContentType(t)}
                  disabled={stage === 'generating'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    contentType === t
                      ? 'bg-[#E1FF00] text-black'
                      : 'bg-white/5 text-[#d1d1c6] hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {t === 'news' ? 'News Commentary' : 'Blog Post'}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#6D6D69] mt-2">
              {contentType === 'news'
                ? 'Short headline + summary + TSC\'s editorial take on the news.'
                : '800–1500 word TSC-branded article inspired by the source.'}
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!url.trim() || stage === 'generating'}
            className="w-full py-3 rounded-lg bg-[#E1FF00] text-black font-semibold text-sm hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {stage === 'generating' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                Generating…
              </span>
            ) : 'Generate'}
          </button>
        </div>
      )}

      {(stage === 'preview' || stage === 'publishing') && generated && meta && (
        <div className="space-y-5">
          {/* Source */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-[#6D6D69] mb-1">Source</p>
            <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#73F5FF] hover:text-white transition-colors truncate block">
              {meta.sourceTitle}
            </a>
            <p className="text-xs text-[#6D6D69] mt-0.5">{meta.sourceName}</p>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69]">Preview</p>

            {contentType === 'news' ? (
              <>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Headline</p>
                  <p className="text-white font-medium">{String(generated.headline ?? '')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Summary</p>
                  <p className="text-sm text-[#d1d1c6]">{String(generated.summary ?? '')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Our Take (commentary)</p>
                  <p className="text-sm text-[#d1d1c6] whitespace-pre-wrap line-clamp-6">{String(generated.commentary ?? '')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#d1d1c6]">{String(generated.category ?? '')}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#d1d1c6]">{String(generated.sentiment ?? '')}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#d1d1c6]">impact: {String(generated.impact ?? '')}</span>
                  {(generated.tags as string[] ?? []).map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#6D6D69]">{t}</span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Title</p>
                  <p className="text-white font-medium">{String(generated.title ?? '')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Description</p>
                  <p className="text-sm text-[#d1d1c6]">{String(generated.description ?? '')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Author</p>
                  <p className="text-sm text-[#d1d1c6]">{String(generated.author ?? '')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D6D69] mb-1">Content (preview)</p>
                  <p className="text-sm text-[#d1d1c6] whitespace-pre-wrap line-clamp-6">{String(generated.content ?? '')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(generated.tags as string[] ?? []).map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#6D6D69]">{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePublish}
              disabled={stage === 'publishing'}
              className="flex-1 py-3 rounded-lg bg-[#E1FF00] text-black font-semibold text-sm hover:bg-white transition-colors disabled:opacity-40"
            >
              {stage === 'publishing' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Publishing…
                </span>
              ) : 'Publish Now'}
            </button>
            <button
              onClick={reset}
              disabled={stage === 'publishing'}
              className="px-6 py-3 rounded-lg border border-white/10 text-sm text-[#d1d1c6] hover:text-white hover:border-white/30 transition-colors disabled:opacity-40"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
