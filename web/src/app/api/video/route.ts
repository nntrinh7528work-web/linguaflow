import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { url, language } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const langLabel = language === 'japanese' ? 'tiếng Nhật' : 'tiếng Anh';

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Bạn là chuyên gia phân tích video học ${langLabel}. Dựa trên URL YouTube này: ${url}

Hãy tạo một bản tóm tắt học tập với format sau:

## 📋 Tóm tắt nội dung
(Tóm tắt ngắn gọn nội dung video)

## 📖 Từ vựng quan trọng
(Liệt kê 5-10 từ vựng chính, mỗi từ có nghĩa và ví dụ)

## 📐 Ngữ pháp nổi bật
(Liệt kê 3-5 điểm ngữ pháp chính được sử dụng trong video)

## 💡 Điểm cần ghi nhớ
(3-5 tips hoặc lưu ý quan trọng từ video)

## 🎯 Bài tập gợi ý
(2-3 bài tập tự luyện từ nội dung video)

Trả lời bằng tiếng Việt, rõ ràng và dễ hiểu.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ analysis: text });
    } catch (error: unknown) {
        console.error('Video analysis error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Lỗi phân tích: ${message}` }, { status: 500 });
    }
}
