'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'quiz' | 'chat';

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

export default function ReviewPage() {
    const [mode, setMode] = useState<Mode>('quiz');

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-foreground">AI Review</h1>
                <p className="text-sm text-muted-foreground mt-1">Ôn tập với trí tuệ nhân tạo Gemini</p>
            </div>

            {/* Mode toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
                <button
                    onClick={() => setMode('quiz')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'quiz' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    🧠 Quiz
                </button>
                <button
                    onClick={() => setMode('chat')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'chat' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    💬 Hỏi AI
                </button>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'quiz' ? <QuizMode key="quiz" /> : <ChatMode key="chat" />}
            </AnimatePresence>
        </div>
    );
}

/* ====================== QUIZ MODE ====================== */
function QuizMode() {
    const supabase = createClient();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizType, setQuizType] = useState<'vocabulary' | 'grammar'>('vocabulary');
    const [language, setLanguage] = useState<'japanese' | 'english'>('japanese');

    const generateQuiz = useCallback(async () => {
        setLoading(true);
        setError(null);
        setQuestions([]);
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setFinished(false);

        try {
            // Fetch notes for quiz material
            const table = quizType === 'vocabulary' ? 'vocabulary_notes' : 'grammar_notes';
            const { data: notes } = await supabase
                .from(table)
                .select('*')
                .eq('language', language)
                .limit(20);

            if (!notes || notes.length < 3) {
                setError(`Cần ít nhất 3 ${quizType === 'vocabulary' ? 'từ vựng' : 'ngữ pháp'} để tạo quiz. Hãy thêm ghi chú trước!`);
                setLoading(false);
                return;
            }

            const notesList = quizType === 'vocabulary'
                ? notes.map((n: Record<string, string>) => `${n.word} - ${n.meaning || ''} (${n.reading || ''})`).join('\n')
                : notes.map((n: Record<string, string>) => `${n.pattern} - ${n.explanation || ''}`).join('\n');

            const langLabel = language === 'japanese' ? 'tiếng Nhật' : 'tiếng Anh';
            const prompt = `Tạo 5 câu quiz trắc nghiệm ${quizType === 'vocabulary' ? 'từ vựng' : 'ngữ pháp'} ${langLabel} từ danh sách sau:\n\n${notesList}`;

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: 'quiz' }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Parse JSON from response
            const text = data.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(text) as QuizQuestion[];
            setQuestions(parsed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi tạo quiz');
        } finally {
            setLoading(false);
        }
    }, [supabase, quizType, language]);

    const handleAnswer = (index: number) => {
        if (selected !== null) return;
        setSelected(index);
        if (index === questions[currentQ].correct) {
            setScore((s) => s + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQ + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrentQ((c) => c + 1);
            setSelected(null);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {questions.length === 0 && !loading && (
                <div className="card-linear p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">🎯 Tạo Quiz mới</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Loại</label>
                            <div className="flex gap-1">
                                <button onClick={() => setQuizType('vocabulary')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${quizType === 'vocabulary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                >📖 Từ vựng</button>
                                <button onClick={() => setQuizType('grammar')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${quizType === 'grammar' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                >📐 Ngữ pháp</button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Ngôn ngữ</label>
                            <div className="flex gap-1">
                                <button onClick={() => setLanguage('japanese')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === 'japanese' ? 'badge-japanese' : 'bg-muted text-muted-foreground'}`}
                                >🇯🇵</button>
                                <button onClick={() => setLanguage('english')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${language === 'english' ? 'badge-english' : 'bg-muted text-muted-foreground'}`}
                                >🇬🇧</button>
                            </div>
                        </div>
                    </div>
                    <button onClick={generateQuiz}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-all"
                    >
                        🤖 Tạo Quiz với AI
                    </button>
                    {error && (
                        <p className="mt-3 text-sm text-destructive">{error}</p>
                    )}
                </div>
            )}

            {loading && (
                <div className="card-linear p-8 text-center">
                    <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Đang tạo quiz với Gemini AI...</p>
                </div>
            )}

            {questions.length > 0 && !finished && (
                <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-linear p-6"
                >
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-muted-foreground">Câu {currentQ + 1}/{questions.length}</span>
                        <span className="text-xs font-medium text-primary">{score} đúng</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted mb-5">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                    </div>

                    {/* Question */}
                    <h3 className="text-base font-semibold text-foreground mb-4">{questions[currentQ].question}</h3>

                    {/* Options */}
                    <div className="space-y-2 mb-4">
                        {questions[currentQ].options.map((opt, i) => {
                            const isCorrect = i === questions[currentQ].correct;
                            const isSelected = i === selected;
                            let cls = 'border-border hover:border-primary/50 hover:bg-primary/5';
                            if (selected !== null) {
                                if (isCorrect) cls = 'border-emerald-500 bg-emerald-500/10';
                                else if (isSelected) cls = 'border-destructive bg-destructive/10';
                                else cls = 'border-border opacity-50';
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    disabled={selected !== null}
                                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls} disabled:cursor-default`}
                                >
                                    <span className="font-medium text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                                    {opt}
                                    {selected !== null && isCorrect && <span className="float-right">✅</span>}
                                    {selected !== null && isSelected && !isCorrect && <span className="float-right">❌</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {selected !== null && questions[currentQ].explanation && (
                        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-muted/50 mb-4"
                        >
                            <p className="text-xs text-muted-foreground">
                                💡 {questions[currentQ].explanation}
                            </p>
                        </motion.div>
                    )}

                    {selected !== null && (
                        <button onClick={nextQuestion}
                            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                        >
                            {currentQ + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp →'}
                        </button>
                    )}
                </motion.div>
            )}

            {finished && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="card-linear p-8 text-center"
                >
                    <p className="text-5xl mb-3">{score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.5 ? '👍' : '💪'}</p>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                        {score}/{questions.length} câu đúng
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {score >= questions.length * 0.8 ? 'Xuất sắc! Bạn nắm rất vững!' : score >= questions.length * 0.5 ? 'Khá tốt! Cần ôn thêm một chút.' : 'Cố gắng hơn nhé! Hãy ôn lại ghi chú.'}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button onClick={generateQuiz}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                        >🔄 Quiz mới</button>
                        <button onClick={() => { setQuestions([]); setFinished(false); }}
                            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
                        >← Quay lại</button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

/* ====================== CHAT MODE ====================== */
function ChatMode() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const quickPrompts = [
        { label: '🇯🇵 Giải thích "〜てみる"', prompt: 'Giải thích ngữ pháp tiếng Nhật "〜てみる" và cho ví dụ' },
        { label: '🇬🇧 Khác nhau: make vs do', prompt: 'Giải thích sự khác nhau giữa "make" và "do" trong tiếng Anh với ví dụ' },
        { label: '📝 Mẹo nhớ kanji', prompt: 'Cho tôi mẹo ghi nhớ các kanji cơ bản N5 dễ nhất' },
        { label: '💡 Tips học hiệu quả', prompt: 'Cho tôi 5 tips học ngôn ngữ hiệu quả nhất' },
    ];

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: ChatMessage = { role: 'user', content: text.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text.trim(), type: 'chat' }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setMessages((prev) => [...prev, { role: 'ai', content: data.result }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: 'ai', content: `❌ ${err instanceof Error ? err.message : 'Lỗi không xác định'}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="card-linear flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}
        >
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-4xl mb-3">🤖</p>
                        <h3 className="text-base font-semibold text-foreground mb-1">Hỏi AI về ngôn ngữ</h3>
                        <p className="text-xs text-muted-foreground mb-4">Dùng Gemini AI để giải đáp thắc mắc tiếng Nhật & tiếng Anh</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {quickPrompts.map((qp, i) => (
                                <button key={i} onClick={() => sendMessage(qp.prompt)}
                                    className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
                                >
                                    {qp.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-muted text-foreground rounded-bl-sm'
                            }`}>
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</pre>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-xl rounded-bl-sm">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi AI về từ vựng, ngữ pháp, mẹo học..."
                        disabled={loading}
                        className="flex-1 h-10 px-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
