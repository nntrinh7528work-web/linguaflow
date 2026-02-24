'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { getLanguageLabel } from '@/lib/utils';

type Tab = 'vocabulary' | 'grammar' | 'free';
type Language = 'japanese' | 'english';

interface VocabNote {
    id: string;
    language: string;
    word: string;
    reading: string | null;
    meaning: string | null;
    example_sentence: string | null;
    ai_memory_hook: string | null;
    tags: string[] | null;
    created_at: string;
}

interface GrammarNote {
    id: string;
    language: string;
    pattern: string;
    explanation: string | null;
    examples: string[] | null;
    difficulty: string | null;
    created_at: string;
}

interface FreeNote {
    id: string;
    title: string | null;
    content: string | null;
    language: string | null;
    youtube_url: string | null;
    created_at: string;
}

const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'vocabulary', label: 'Từ vựng', icon: '📖' },
    { key: 'grammar', label: 'Ngữ pháp', icon: '📐' },
    { key: 'free', label: 'Ghi chú', icon: '📝' },
];

export default function NotesPage() {
    const [activeTab, setActiveTab] = useState<Tab>('vocabulary');
    const [langFilter, setLangFilter] = useState<Language | 'all'>('all');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Ghi chú</h1>
                    <p className="text-sm text-muted-foreground mt-1">Quản lý từ vựng, ngữ pháp và ghi chú</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                >
                    + Thêm mới
                </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters row */}
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="flex-1 max-w-xs h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <div className="flex gap-1">
                    {(['all', 'japanese', 'english'] as const).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLangFilter(lang)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${langFilter === lang
                                    ? lang === 'japanese' ? 'badge-japanese' : lang === 'english' ? 'badge-english' : 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {lang === 'all' ? 'Tất cả' : lang === 'japanese' ? '🇯🇵' : '🇬🇧'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'vocabulary' && (
                    <VocabularyTab key="vocab" langFilter={langFilter} search={search} showForm={showForm} onCloseForm={() => setShowForm(false)} />
                )}
                {activeTab === 'grammar' && (
                    <GrammarTab key="grammar" langFilter={langFilter} search={search} showForm={showForm} onCloseForm={() => setShowForm(false)} />
                )}
                {activeTab === 'free' && (
                    <FreeTab key="free" langFilter={langFilter} search={search} showForm={showForm} onCloseForm={() => setShowForm(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ====================== VOCABULARY TAB ====================== */
function VocabularyTab({ langFilter, search, showForm, onCloseForm }: { langFilter: string; search: string; showForm: boolean; onCloseForm: () => void }) {
    const supabase = createClient();
    const [notes, setNotes] = useState<VocabNote[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        let query = supabase.from('vocabulary_notes').select('*').order('created_at', { ascending: false });
        if (langFilter !== 'all') query = query.eq('language', langFilter);
        if (search) query = query.or(`word.ilike.%${search}%,meaning.ilike.%${search}%`);
        const { data } = await query.limit(50);
        setNotes((data as VocabNote[]) || []);
        setLoading(false);
    }, [supabase, langFilter, search]);

    useEffect(() => { fetchNotes(); }, [fetchNotes]);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const tagsStr = form.get('tags') as string;
        await supabase.from('vocabulary_notes').insert({
            language: form.get('language'),
            word: form.get('word'),
            reading: form.get('reading') || null,
            meaning: form.get('meaning') || null,
            example_sentence: form.get('example') || null,
            tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()) : null,
        });
        onCloseForm();
        fetchNotes();
    };

    const handleDelete = async (id: string) => {
        await supabase.from('vocabulary_notes').delete().eq('id', id);
        fetchNotes();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Add form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd}
                        className="card-linear p-5 mb-4 space-y-3 overflow-hidden"
                    >
                        <h3 className="text-sm font-semibold text-foreground">Thêm từ vựng mới</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <select name="language" required className="h-9 px-3 rounded-lg border border-input bg-background text-sm">
                                <option value="japanese">🇯🇵 Tiếng Nhật</option>
                                <option value="english">🇬🇧 Tiếng Anh</option>
                            </select>
                            <input name="word" required placeholder="Từ vựng *" className="h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                            <input name="reading" placeholder="Cách đọc (hiragana)" className="h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                            <input name="meaning" placeholder="Nghĩa" className="h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                        </div>
                        <input name="example" placeholder="Câu ví dụ" className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                        <input name="tags" placeholder="Tags (phân cách bằng dấu phẩy)" className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                        <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Lưu</button>
                            <button type="button" onClick={onCloseForm} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">Hủy</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Notes list */}
            {loading ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-20 shimmer rounded-lg" />)}</div>
            ) : notes.length === 0 ? (
                <EmptyState message="Chưa có từ vựng nào" />
            ) : (
                <div className="space-y-2">
                    {notes.map((note) => {
                        const lang = getLanguageLabel(note.language as Language);
                        return (
                            <motion.div key={note.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="card-linear p-4 group hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm">{lang.emoji}</span>
                                            <span className="text-base font-bold text-foreground">{note.word}</span>
                                            {note.reading && <span className="text-xs text-muted-foreground">({note.reading})</span>}
                                        </div>
                                        {note.meaning && <p className="text-sm text-foreground/80 mb-1">{note.meaning}</p>}
                                        {note.example_sentence && (
                                            <p className="text-xs text-muted-foreground italic">&ldquo;{note.example_sentence}&rdquo;</p>
                                        )}
                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex gap-1 mt-2">
                                                {note.tags.map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

/* ====================== GRAMMAR TAB ====================== */
function GrammarTab({ langFilter, search, showForm, onCloseForm }: { langFilter: string; search: string; showForm: boolean; onCloseForm: () => void }) {
    const supabase = createClient();
    const [notes, setNotes] = useState<GrammarNote[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        let query = supabase.from('grammar_notes').select('*').order('created_at', { ascending: false });
        if (langFilter !== 'all') query = query.eq('language', langFilter);
        if (search) query = query.or(`pattern.ilike.%${search}%,explanation.ilike.%${search}%`);
        const { data } = await query.limit(50);
        setNotes((data as GrammarNote[]) || []);
        setLoading(false);
    }, [supabase, langFilter, search]);

    useEffect(() => { fetchNotes(); }, [fetchNotes]);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const examplesStr = form.get('examples') as string;
        await supabase.from('grammar_notes').insert({
            language: form.get('language'),
            pattern: form.get('pattern'),
            explanation: form.get('explanation') || null,
            examples: examplesStr ? examplesStr.split('\n').filter(Boolean) : null,
            difficulty: form.get('difficulty') || null,
        });
        onCloseForm();
        fetchNotes();
    };

    const handleDelete = async (id: string) => {
        await supabase.from('grammar_notes').delete().eq('id', id);
        fetchNotes();
    };

    const difficultyLabel: Record<string, { text: string; color: string }> = {
        beginner: { text: 'Cơ bản', color: 'text-emerald-500 bg-emerald-500/10' },
        intermediate: { text: 'Trung bình', color: 'text-amber-500 bg-amber-500/10' },
        advanced: { text: 'Nâng cao', color: 'text-red-500 bg-red-500/10' },
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd}
                        className="card-linear p-5 mb-4 space-y-3 overflow-hidden"
                    >
                        <h3 className="text-sm font-semibold text-foreground">Thêm ngữ pháp mới</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <select name="language" required className="h-9 px-3 rounded-lg border border-input bg-background text-sm">
                                <option value="japanese">🇯🇵 Tiếng Nhật</option>
                                <option value="english">🇬🇧 Tiếng Anh</option>
                            </select>
                            <select name="difficulty" className="h-9 px-3 rounded-lg border border-input bg-background text-sm">
                                <option value="">Độ khó</option>
                                <option value="beginner">Cơ bản</option>
                                <option value="intermediate">Trung bình</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                        <input name="pattern" required placeholder="Mẫu ngữ pháp *" className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                        <textarea name="explanation" placeholder="Giải thích" rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground resize-none" />
                        <textarea name="examples" placeholder="Ví dụ (mỗi dòng 1 ví dụ)" rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground resize-none" />
                        <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Lưu</button>
                            <button type="button" onClick={onCloseForm} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">Hủy</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-24 shimmer rounded-lg" />)}</div>
            ) : notes.length === 0 ? (
                <EmptyState message="Chưa có ngữ pháp nào" />
            ) : (
                <div className="space-y-2">
                    {notes.map((note) => {
                        const lang = getLanguageLabel(note.language as Language);
                        const diff = note.difficulty ? difficultyLabel[note.difficulty] : null;
                        return (
                            <motion.div key={note.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="card-linear p-4 group hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm">{lang.emoji}</span>
                                            <span className="text-base font-bold text-foreground">{note.pattern}</span>
                                            {diff && (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${diff.color}`}>{diff.text}</span>
                                            )}
                                        </div>
                                        {note.explanation && <p className="text-sm text-foreground/80 mb-2">{note.explanation}</p>}
                                        {note.examples && note.examples.length > 0 && (
                                            <div className="space-y-1">
                                                {note.examples.map((ex, i) => (
                                                    <p key={i} className="text-xs text-muted-foreground pl-3 border-l-2 border-primary/30">{ex}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

/* ====================== FREE NOTES TAB ====================== */
function FreeTab({ langFilter, search, showForm, onCloseForm }: { langFilter: string; search: string; showForm: boolean; onCloseForm: () => void }) {
    const supabase = createClient();
    const [notes, setNotes] = useState<FreeNote[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        let query = supabase.from('free_notes').select('*').order('created_at', { ascending: false });
        if (langFilter !== 'all') query = query.eq('language', langFilter);
        if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        const { data } = await query.limit(50);
        setNotes((data as FreeNote[]) || []);
        setLoading(false);
    }, [supabase, langFilter, search]);

    useEffect(() => { fetchNotes(); }, [fetchNotes]);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        await supabase.from('free_notes').insert({
            title: form.get('title') || null,
            content: form.get('content') || null,
            language: form.get('language') || null,
            youtube_url: form.get('youtube_url') || null,
        });
        onCloseForm();
        fetchNotes();
    };

    const handleDelete = async (id: string) => {
        await supabase.from('free_notes').delete().eq('id', id);
        fetchNotes();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAdd}
                        className="card-linear p-5 mb-4 space-y-3 overflow-hidden"
                    >
                        <h3 className="text-sm font-semibold text-foreground">Thêm ghi chú mới</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <input name="title" placeholder="Tiêu đề" className="h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                            <select name="language" className="h-9 px-3 rounded-lg border border-input bg-background text-sm">
                                <option value="">Ngôn ngữ (tùy chọn)</option>
                                <option value="japanese">🇯🇵 Tiếng Nhật</option>
                                <option value="english">🇬🇧 Tiếng Anh</option>
                            </select>
                        </div>
                        <textarea name="content" placeholder="Nội dung ghi chú..." rows={4} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground resize-none" />
                        <input name="youtube_url" placeholder="YouTube URL (tùy chọn)" className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground" />
                        <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Lưu</button>
                            <button type="button" onClick={onCloseForm} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">Hủy</button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="grid sm:grid-cols-2 gap-2">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 shimmer rounded-lg" />)}</div>
            ) : notes.length === 0 ? (
                <EmptyState message="Chưa có ghi chú nào" />
            ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                    {notes.map((note) => (
                        <motion.div key={note.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="card-linear p-4 group hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground truncate">
                                    {note.title || 'Không có tiêu đề'}
                                </h4>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all text-xs flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                            {note.content && (
                                <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{note.content}</p>
                            )}
                            <div className="flex items-center gap-2">
                                {note.language && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${note.language === 'japanese' ? 'badge-japanese' : 'badge-english'
                                        }`}>
                                        {note.language === 'japanese' ? '🇯🇵' : '🇬🇧'}
                                    </span>
                                )}
                                {note.youtube_url && (
                                    <a href={note.youtube_url} target="_blank" rel="noopener noreferrer"
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                    >
                                        ▶ YouTube
                                    </a>
                                )}
                                <span className="text-[10px] text-muted-foreground ml-auto">
                                    {new Date(note.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

/* ====================== EMPTY STATE ====================== */
function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-12">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground mt-1">Nhấn &ldquo;+ Thêm mới&rdquo; để bắt đầu</p>
        </div>
    );
}
