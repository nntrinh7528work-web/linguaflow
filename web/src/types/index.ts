/**
 * LinguaFlow — Core TypeScript type definitions
 * All database models and shared types used across the application.
 */

/** Supported study languages */
export type Language = 'japanese' | 'english';

/** Study session completion status */
export type SessionStatus = 'completed' | 'partial' | 'missed';

/** Schedule status */
export type ScheduleStatus = 'pending' | 'completed' | 'partial' | 'missed';

/** Grammar difficulty levels */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/** Quiz question types */
export type QuizQuestionType = 'meaning' | 'fill-blank' | 'particle' | 'correction';

/** Theme modes */
export type ThemeMode = 'light' | 'dark' | 'system';

/** User profile — extends Supabase auth.users */
export interface Profile {
    id: string;
    full_name: string | null;
    telegram_chat_id: string | null;
    telegram_bot_token: string | null;
    pomodoro_work_minutes: number;
    pomodoro_break_minutes: number;
    daily_reminder_time: string;
    created_at: string;
}

/** Study session (each Pomodoro block) */
export interface StudySession {
    id: string;
    user_id: string;
    language: Language;
    topic: string | null;
    started_at: string;
    ended_at: string | null;
    pomodoro_count: number;
    status: SessionStatus;
    created_at: string;
}

/** Vocabulary note entry */
export interface VocabularyNote {
    id: string;
    user_id: string;
    session_id: string | null;
    language: Language;
    word: string;
    reading: string | null;
    meaning: string | null;
    example_sentence: string | null;
    ai_memory_hook: string | null;
    tags: string[];
    created_at: string;
}

/** Grammar note entry */
export interface GrammarNote {
    id: string;
    user_id: string;
    session_id: string | null;
    language: Language;
    pattern: string;
    explanation: string | null;
    examples: string[];
    difficulty: Difficulty;
    created_at: string;
}

/** Free-form note */
export interface FreeNote {
    id: string;
    user_id: string;
    session_id: string | null;
    title: string | null;
    content: string | null;
    youtube_url: string | null;
    language: string | null;
    created_at: string;
}

/** Study schedule entry */
export interface Schedule {
    id: string;
    user_id: string;
    date: string;
    start_time: string | null;
    end_time: string | null;
    language: Language;
    topic: string | null;
    goal: string | null;
    status: ScheduleStatus;
    created_at: string;
}

/** Quiz session record */
export interface QuizSession {
    id: string;
    user_id: string;
    score: number | null;
    total: number | null;
    questions_json: QuizQuestion[];
    language: string | null;
    created_at: string;
}

/** Individual quiz question */
export interface QuizQuestion {
    question: string;
    type: QuizQuestionType;
    choices: [string, string, string, string];
    correct: 'A' | 'B' | 'C' | 'D';
    explanation: string;
}

/** Video analysis record */
export interface VideoAnalysis {
    id: string;
    user_id: string;
    youtube_url: string | null;
    language: string | null;
    title: string | null;
    result_json: VideoAnalysisResult | null;
    created_at: string;
}

/** Structured video analysis result from Gemini */
export interface VideoAnalysisResult {
    summary: string;
    vocabulary: VideoVocabulary[];
    grammar_patterns: VideoGrammar[];
    comprehension_questions: VideoQuestion[];
    natural_phrases: VideoPhrase[];
}

export interface VideoVocabulary {
    word: string;
    reading: string;
    meaning: string;
    example: string;
}

export interface VideoGrammar {
    pattern: string;
    explanation: string;
    example: string;
}

export interface VideoQuestion {
    question: string;
    answer: string;
}

export interface VideoPhrase {
    phrase: string;
    meaning: string;
    usage_tip: string;
}

/** Chat message for conversation practice */
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    corrections?: string;
    timestamp: string;
}

/** Conversation scenario */
export interface ConversationScenario {
    id: string;
    label: string;
    labelVi: string;
    icon: string;
}

/** Form input state for creating vocabulary */
export interface VocabularyFormData {
    word: string;
    reading: string;
    meaning: string;
    example_sentence: string;
    language: Language;
    tags: string[];
}

/** Form input state for creating grammar note */
export interface GrammarFormData {
    pattern: string;
    explanation: string;
    examples: string[];
    difficulty: Difficulty;
    language: Language;
}

/** Form input state for creating schedule */
export interface ScheduleFormData {
    date: string;
    start_time: string;
    end_time: string;
    language: Language;
    topic: string;
    goal: string;
}
