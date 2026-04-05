'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, ArrowRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useGamification } from '../hooks/useGamification';

interface LessonPlan {
  hook: string;
  whatIsThis: string;
  howItWorks: string;
  whyItMatters: string;
  vocabulary: string[];
  tryThis: string;
  question: string;
  depth: string;
}

// ─── Share Card ────────────────────────────────────────────────
function ShareCard({ result, item }: { result: LessonPlan; item: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.9, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `overstood-${item}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `Overstood: ${item}`, text: `I just understood ${item} with Overstood.` });
      } else {
        const link = document.createElement('a');
        link.download = `overstood-${item}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch { /* share cancelled or failed */ }
    setSharing(false);
  }, [item]);

  return (
    <div className="hidden">
      <div ref={cardRef} className="fixed -left-[9999px] top-0" style={{ width: 600, height: 700, background: '#08080B', padding: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #FF6B35, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 16, height: 16, color: 'white' }} />
          </div>
          <span style={{ color: '#888', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>OVERSTOOD</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#F5F5F7', marginBottom: 8, letterSpacing: '-0.02em' }} className="capitalize">{item}</h1>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 32, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Overstood</p>
        {result.hook && (
          <div style={{ background: 'rgba(255,107,53,0.08)', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid rgba(255,107,53,0.15)' }}>
            <p style={{ fontSize: 16, color: '#F5F5F7', lineHeight: 1.6, fontWeight: 500 }}>"{result.hook}"</p>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#FF6B35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>What is this</p>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>{result.whatIsThis}</p>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#FFD700', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Why it matters</p>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7 }}>{result.whyItMatters}</p>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 48, right: 48, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: '#333' }}>overstood.app</span>
          <span style={{ fontSize: 11, color: '#333' }}>Understand what you see</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function GeneratePage() {
  const [input, setInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [depth, setDepth] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [result, setResult] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addDiscovery } = useGamification();

  const generate = useCallback(async (item: string, imageData?: string | null) => {
    setSubject(item);
    setLoading(true);
    setLoadingMessage('Finding clarity');
    setError('');
    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, depth }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const lesson = data.lesson as LessonPlan;
      lesson.depth = depth.charAt(0).toUpperCase() + depth.slice(1);
      setResult(lesson);
      if (imageData) setPhotoPreview(imageData);
      addDiscovery();
    } catch {
      setError('Could not generate right now. Try again.');
    } finally {
      setLoading(false);
    }
  }, [depth, addDiscovery]);

  const analyzeImage = useCallback(async (imageData: string, file?: File) => {
    setPhotoPreview(imageData);
    setInput('');
    setLoading(true);
    setLoadingMessage('Seeing what you see');
    setError('');

    try {
      let imageToSend = imageData;
      if (file && (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic'))) {
        try {
          const img = document.createElement('img');
          img.src = imageData;
          await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(); });
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d')!.drawImage(img, 0, 0);
          imageToSend = canvas.toDataURL('image/jpeg', 0.9);
        } catch { /* use original */ }
      }

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageToSend }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      if (!data.subject) throw new Error();

      await generate(data.subject, imageData);
    } catch {
      setError('Could not read that image. Type what you see instead.');
      setLoading(false);
      setPhotoPreview(null);
    }
  }, [generate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      analyzeImage(dataUrl, file);
    };
    reader.onerror = () => {
      setError('Could not read that file.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    generate(trimmed);
  };

  const handleTryAnother = () => {
    setInput('');
    setSubject('');
    setPhotoPreview(null);
    setResult(null);
    setError('');
    setDepth('standard');
    inputRef.current?.focus();
  };

  const isActive = !result && !loading;

  return (
    <div style={{ minHeight: '100vh', background: '#08080B', color: '#F5F5F7', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(8,8,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #FF6B35, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 13, height: 13, color: 'white' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#F5F5F7' }}>OVERSTOOD</span>
          </div>
          {result && (
            <button
              onClick={handleTryAnother}
              style={{ fontSize: 12, color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 0' }}
            >
              New
            </button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>

        {/* ── INPUT STATE ── */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ paddingTop: 80, paddingBottom: 60 }}
          >

            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5 }}
                style={{ fontSize: 'clamp(32px, 7vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#F5F5F7', marginBottom: 16 }}
              >
                Understand anything.
                <br />
                <span style={{ color: '#FF6B35' }}>Instantly.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.4 }}
                style={{ fontSize: 15, color: '#666', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}
              >
                Snap a photo or type what you want to understand.
              </motion.p>
            </div>

            {/* Input field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              style={{
                background: '#111114',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.07)',
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 18px', gap: 12 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="What do you want to understand?"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: 15,
                    color: '#F5F5F7',
                    fontFamily: 'inherit',
                  }}
                  autoFocus
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#555', display: 'flex', alignItems: 'center' }}
                >
                  <Camera style={{ width: 20, height: 20 }} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
              </div>

              {/* Depth row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#444', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Depth</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['quick', 'standard', 'deep'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDepth(d)}
                      style={{
                        padding: '5px 14px',
                        borderRadius: 100,
                        fontSize: 12,
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                        background: depth === d ? '#FF6B35' : 'rgba(255,255,255,0.06)',
                        color: depth === d ? '#fff' : '#555',
                      }}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.24 }}
              onClick={handleSubmit}
              disabled={!input.trim()}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: 12,
                background: input.trim() ? '#FF6B35' : 'rgba(255,107,53,0.15)',
                color: input.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.03em',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s',
              }}
            >
              Understand this
              <ArrowRight style={{ width: 16, height: 16 }} />
            </motion.button>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', color: '#FF4444', fontSize: 12, marginTop: 14 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Examples */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: 56 }}
            >
              <p style={{ fontSize: 11, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 18, fontWeight: 600 }}>
                Try these
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, justifyContent: 'center' }}>
                {[
                  'Why is the sky blue?',
                  'How do elevators work?',
                  'What is a barcode?',
                  'Why do fire hydrants have caps?',
                ].map(ex => (
                  <button
                    key={ex}
                    onClick={() => { setInput(ex); inputRef.current?.focus(); }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 100,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#666',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── LOADING STATE ── */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 20 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,107,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ width: 20, height: 20, color: '#FF6B35' }} />
              </div>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: '#888', fontWeight: 500 }}>{loadingMessage}</p>
            </div>
            {photoPreview && (
              <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', maxWidth: 240, width: '100%' }}>
                <img src={photoPreview} alt="Your capture" style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 180 }} />
              </div>
            )}
          </motion.div>
        )}

        {/* ── RESULT STATE ── */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ paddingTop: 60, paddingBottom: 100 }}
          >
            {/* Subject */}
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#FF6B35', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Overstood</p>
              <h1 style={{ fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#F5F5F7' }} className="capitalize">
                {subject}
              </h1>
            </div>

            {/* Hook */}
            {result.hook && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: 20 }}
              >
                <div style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.12)', borderRadius: 14, padding: '22px 24px' }}>
                  <p style={{ fontSize: 16, color: '#F5F5F7', lineHeight: 1.65, fontWeight: 500 }}>"{result.hook}"</p>
                </div>
              </motion.div>
            )}

            {/* Sections */}
            {[
              { label: 'What is this', value: result.whatIsThis, color: '#FF6B35' },
              { label: 'How it works', value: result.howItWorks, color: '#FFD700' },
              { label: 'Why it matters', value: result.whyItMatters, color: '#B866D6' },
            ].map(({ label, value, color }) => value ? (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ marginBottom: 14 }}
              >
                <div style={{ background: '#111114', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, color }}>{label}</p>
                  <p style={{ fontSize: 14, color: '#888', lineHeight: 1.75 }}>{value}</p>
                </div>
              </motion.div>
            ) : null)}

            {/* Vocabulary */}
            {result.vocabulary?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: 14 }}
              >
                <div style={{ background: '#111114', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, color: '#555' }}>Key ideas</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.vocabulary.map((v, i) => (
                      <span key={i} style={{ fontSize: 12, color: '#777', background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.06)' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Try it */}
            {result.tryThis && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ marginBottom: 14 }}
              >
                <div style={{ background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.12)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, color: '#00C896' }}>Try it</p>
                  <p style={{ fontSize: 14, color: '#888', lineHeight: 1.75 }}>{result.tryThis}</p>
                </div>
              </motion.div>
            )}

            {/* Question */}
            {result.question && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                style={{ marginBottom: 14 }}
              >
                <div style={{ background: '#111114', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, color: '#444' }}>Question</p>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75, fontStyle: 'italic' }}>{result.question}</p>
                </div>
              </motion.div>
            )}

            {/* Photo */}
            {photoPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}
              >
                <img src={photoPreview} alt="Your capture" style={{ width: '100%', objectFit: 'cover', display: 'block', maxHeight: 260 }} />
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <ShareCard result={result} item={subject} />
              <button
                onClick={() => {
                  const dataUrl = document.querySelector('.share-btn')?.getAttribute('data-url');
                  if (dataUrl) {
                    const a = document.createElement('a');
                    a.download = `overstood-${subject}.png`;
                    a.href = dataUrl;
                    a.click();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#666',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                Share what I understood
              </button>
            </motion.div>

            {/* Try another */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36 }}
              onClick={handleTryAnother}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 10,
                padding: '14px',
                background: 'transparent',
                border: 'none',
                color: '#444',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
            >
              Explore something else →
            </motion.button>

          </motion.div>
        )}

      </main>
    </div>
  );
}
