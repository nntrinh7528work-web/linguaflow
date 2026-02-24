'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoAnalysis {
    id?: string;
    youtube_url: string;
    language: string;
    analysis: string;
    created_at?: string;
}

/** Extract YouTube video ID from URL */
function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

export default function VideoPage() {
    const supabase = createClient();
    const [url, setUrl] = useState('');
    const [language, setLanguage] = useState<'japanese' | 'english'>('japanese');
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<VideoAnalysis[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch history
    const fetchHistory = useCallback(async () => {
        const { data } = await supabase
            .from('video_analyses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        setHistory((data as VideoAnalysis[]) || []);
        setShowHistory(true);
    }, [supabase]);

    // Analyze video
    const handleAnalyze = async () => {
        if (!url.trim()) return;

        const videoId = getYouTubeId(url);
        if (!videoId) {
            setError('URL YouTube không hợp lệ. Vui lòng nhập đúng link YouTube.');
            return;
        }

        setLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const res = await fetch('/api/video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, language }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setAnalysis(data.analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi phân tích video');
        } finally {
            setLoading(false);
        }
    };

    // Save analysis
    const handleSave = async () => {
        if (!analysis || !url) return;
        setSaving(true);
        try {
            await supabase.from('video_analyses').insert({
                youtube_url: url,
                language,
                analysis,
            });
            setSaving(false);
        } catch {
            setSaving(false);
        }
    };

    // Load from history
    const loadFromHistory = (item: VideoAnalysis) => {
        setUrl(item.youtube_url);
        setLanguage(item.language as 'japanese' | 'english');
        setAnalysis(item.analysis);
        setShowHistory(false);
    };

    const videoId = getYouTubeId(url);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Video Analyzer</h1>
                    <p className="text-sm text-muted-foreground mt-1">Phân tích video YouTube với AI</p>
                </div>
                <button
                    onClick={fetchHistory}
                    className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:text-foreground transition-all"
                >
                    📋 Lịch sử
                </button>
            </div>

            {/* URL Input */}
            <div className="card-linear p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">🔗 Nhập link YouTube</h3>
                <div className="flex gap-3 mb-3">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        disabled={loading}
                        className="flex-1 h-10 px-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
                    />
                    <div className="flex gap-1">
                        <button
                            onClick={() => setLanguage('japanese')}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${language === 'japanese' ? 'badge-japanese' : 'bg-muted text-muted-foreground'
                                }`}
                        >🇯🇵</button>
                        <button
                            onClick={() => setLanguage('english')}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${language === 'english' ? 'badge-english' : 'bg-muted text-muted-foreground'
                                }`}
                        >🇬🇧</button>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={loading || !url.trim()}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-sm font-semibold shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Đang phân tích...
                        </span>
                    ) : (
                        '🤖 Phân tích video'
                    )}
                </motion.button>

                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            </div>

            {/* Video preview + analysis */}
            <div className="grid lg:grid-cols-2 gap-4">
                {/* Video embed */}
                {videoId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-linear p-4">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Analysis result */}
                {(analysis || loading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`card-linear p-5 ${!videoId ? 'lg:col-span-2' : ''}`}
                    >
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">Đang phân tích video với Gemini AI...</p>
                                <p className="text-xs text-muted-foreground mt-1">Quá trình này có thể mất 10-30 giây</p>
                            </div>
                        ) : analysis ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-foreground">📊 Kết quả phân tích</h3>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium hover:bg-emerald-500/20 disabled:opacity-50 transition-all"
                                    >
                                        {saving ? '✓ Đã lưu' : '💾 Lưu lại'}
                                    </button>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <MarkdownRenderer content={analysis} />
                                </div>
                            </>
                        ) : null}
                    </motion.div>
                )}
            </div>

            {/* History modal */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowHistory(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl p-5 w-full max-w-lg max-h-[70vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-foreground">📋 Lịch sử phân tích</h3>
                                <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
                            </div>
                            {history.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">Chưa có lịch sử phân tích</p>
                            ) : (
                                <div className="space-y-2">
                                    {history.map((item, i) => (
                                        <button
                                            key={item.id || i}
                                            onClick={() => loadFromHistory(item)}
                                            className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <p className="text-sm font-medium text-foreground truncate">{item.youtube_url}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {item.language === 'japanese' ? '🇯🇵' : '🇬🇧'} • {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : ''}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/** Simple markdown renderer for AI output */
function MarkdownRenderer({ content }: { content: string }) {
    const lines = content.split('\n');

    return (
        <div className="space-y-2">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-2" />;
                if (trimmed.startsWith('## ')) {
                    return <h3 key={i} className="text-sm font-bold text-foreground mt-4 mb-2">{trimmed.replace('## ', '')}</h3>;
                }
                if (trimmed.startsWith('### ')) {
                    return <h4 key={i} className="text-xs font-semibold text-foreground mt-3 mb-1">{trimmed.replace('### ', '')}</h4>;
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return <p key={i} className="text-xs text-foreground/80 pl-3 border-l-2 border-primary/20">{trimmed.slice(2)}</p>;
                }
                if (/^\d+\./.test(trimmed)) {
                    return <p key={i} className="text-xs text-foreground/80 pl-3">{trimmed}</p>;
                }
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return <p key={i} className="text-xs font-semibold text-foreground">{trimmed.replace(/\*\*/g, '')}</p>;
                }
                return <p key={i} className="text-xs text-foreground/80 leading-relaxed">{trimmed}</p>;
            })}
        </div>
    );
}
