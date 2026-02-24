import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { prompt, type } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        let systemPrompt = '';

        if (type === 'quiz') {
            systemPrompt = `Bạn là một giáo viên ngôn ngữ chuyên nghiệp. Tạo câu hỏi trắc nghiệm từ danh sách từ vựng/ngữ pháp được cung cấp.
Trả về JSON array với format:
[{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}]
Chỉ trả JSON, không thêm text khác. Tạo đúng 5 câu hỏi. Viết câu hỏi bằng tiếng Việt.`;
        } else if (type === 'explain') {
            systemPrompt = `Bạn là một giáo viên ngôn ngữ chuyên nghiệp, giải thích ngắn gọn và dễ hiểu bằng tiếng Việt. Trả lời súc tích, có ví dụ minh họa.`;
        } else if (type === 'memory_hook') {
            systemPrompt = `Bạn là chuyên gia ghi nhớ từ vựng. Tạo mẹo ghi nhớ sáng tạo, vui nhộn bằng tiếng Việt. Trả lời ngắn gọn trong 1-2 câu.`;
        } else {
            systemPrompt = `Bạn là trợ lý học ngôn ngữ thông minh, giúp người Việt học tiếng Nhật và tiếng Anh. Trả lời bằng tiếng Việt, rõ ràng và hữu ích.`;
        }

        const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`);
        const text = result.response.text();

        return NextResponse.json({ result: text });
    } catch (error: unknown) {
        console.error('Gemini API error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Lỗi AI: ${message}` }, { status: 500 });
    }
}
