import OpenAI from 'openai';

/**
 * Creates and returns an OpenAI client instance.
 * API key is read from OPENAI_API_KEY environment variable.
 * This should only be used in server components or API routes.
 */
export function createOpenAIClient(): OpenAI {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

/**
 * System prompt for vocabulary enhancement.
 */
export const VOCAB_ENHANCE_SYSTEM_PROMPT = `You are a language learning assistant. Respond ONLY in Vietnamese.
When enhancing vocabulary, return a JSON object with:
- meaning: clear Vietnamese meaning
- example_sentence: natural example sentence with Vietnamese translation
- memory_hook: a creative Vietnamese mnemonic to remember this word`;

/**
 * System prompt for daily study summary.
 */
export const SUMMARY_SYSTEM_PROMPT = `You are a helpful study assistant. Summarize in Vietnamese, in a friendly and encouraging tone.
Create a structured summary with:
1. 📚 Key vocabulary learned
2. 🏗️ Grammar patterns practiced
3. 💡 Key takeaways to remember
4. 🎯 Suggestions for what to review today
Keep it concise and motivating.`;

/**
 * System prompt for quiz generation.
 */
export const QUIZ_SYSTEM_PROMPT = `You are a language quiz generator. Return ONLY valid JSON, no markdown.
Generate multiple choice questions with the format:
[{
  "question": string,
  "type": "meaning" | "fill-blank" | "particle" | "correction",
  "choices": [A, B, C, D],
  "correct": "A" | "B" | "C" | "D",
  "explanation": string (in Vietnamese)
}]`;

/**
 * Creates the system prompt for conversation practice.
 */
export function getConversationPrompt(language: string, scenario: string): string {
    return `You are a native ${language} speaker. We are having a conversation in the scenario: ${scenario}.
Rules:
- Respond naturally in ${language}
- After your response, add a "Corrections:" section (if the user made mistakes) formatted as:
  ❌ [wrong phrase] → ✅ [correct phrase]: [explanation in Vietnamese]
- If no mistakes, add "✅ Không có lỗi ngữ pháp!"
- Keep responses conversational, 2–4 sentences max`;
}
