import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Creates and returns a Google Generative AI (Gemini) client instance.
 * API key is read from GEMINI_API_KEY environment variable.
 * This should only be used in server components or API routes.
 */
export function createGeminiClient(): GoogleGenerativeAI {
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

/**
 * System prompt for YouTube video analysis.
 */
export function getVideoAnalysisPrompt(language: string): string {
    return `You are a language learning assistant for a Vietnamese user studying ${language}.
Analyze this transcript from a YouTube video and return ONLY valid JSON (no markdown).

Return:
{
  "summary": "Tóm tắt nội dung video bằng tiếng Việt (3-5 câu)",
  "vocabulary": [{"word": "", "reading": "", "meaning": "", "example": ""}],
  "grammar_patterns": [{"pattern": "", "explanation": "", "example": ""}],
  "comprehension_questions": [{"question": "", "answer": ""}],
  "natural_phrases": [{"phrase": "", "meaning": "", "usage_tip": ""}]
}`;
}
