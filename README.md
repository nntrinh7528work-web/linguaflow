# 🧠 LinguaFlow

Ứng dụng học tiếng Nhật 🇯🇵 và tiếng Anh 🇬🇧 thông minh — tích hợp Pomodoro, ghi chú AI, phân tích video, và hội thoại.

## ✨ Tính năng

- 🍅 **Pomodoro Timer** — Quản lý thời gian học tập hiệu quả
- 📓 **Ghi chú thông minh** — Từ vựng, ngữ pháp, ghi chú tự do
- 🤖 **Ôn tập AI** — Tóm tắt, quiz, hội thoại với GPT-4o
- 🎬 **Phân tích Video** — Phân tích YouTube với Gemini AI
- 📅 **Lịch học** — Lên kế hoạch và theo dõi tiến độ
- 📱 **Telegram Bot** — Nhắc nhở học tập tự động

## 🛠️ Tech Stack

- **Web:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth + PostgreSQL + Edge Functions)
- **AI:** OpenAI GPT-4o + Google Gemini 1.5 Pro
- **UI:** Framer Motion + Lucide Icons + Recharts

## 🚀 Bắt đầu

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/linguaflow.git
cd linguaflow/web

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

## 📁 Cấu trúc dự án

```
linguaflow/
├── web/                    # Next.js 14 App
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities & API clients
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript types
│   └── package.json
│
└── supabase/               # Supabase Backend
    ├── migrations/         # SQL migrations
    └── functions/          # Edge Functions
```

## 📄 License

MIT
