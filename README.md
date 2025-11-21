Ultra Subtitle Translator
Extract and translate subtitles from any video — right in your browser.
Perfect for indie creators, editors, and language learners.

🌟 Features
🎬 Drag & drop your video (MP4, WebM, etc.)
🔲 Select subtitle region (optional)
🧠 OCR powered by Tesseract.js (runs locally)
🌍 Translate to 100+ languages via OpenAI GPT
💾 Export .srt or .txt subtitle files
🔒 100% local — no file uploads
🚀 How to Use
Upload or drag-drop your video
(Optional) Draw a box around subtitle area
Choose OCR language (e.g., English, Japanese)
Choose translation language
Click ▶ Extract OCR
Enter your OpenAI API key
Click ▶ Translate
Download subtitles as .srt or .txt
🧰 Requirements
Modern browser (Chrome, Edge, Firefox, Safari)
Internet connection (for translation)
Your own OpenAI API key
🗂 Project Structure
subtitle-ui/
├── app/
│   ├── page.tsx         # Main UI
│   ├── components/      # UI components
│   ├── hooks/           # useOcrWorker, etc.
│   ├── globals.css      # Styling
├── public/
│   └── demo.png         # Optional screenshot
├── package.json
├── tsconfig.json
├── next.config.js       # Static export config
📦 Local Development
npm install
npm run dev
To export as static files:

npm run build
npx next export
Deploy the out/ folder to GitHub Pages, Netlify, or Vercel.

🌐 Static Export Setup (Next.js 13+)
// next.config.js
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
module.exports = nextConfig;
💡 Tech Stack
React + TypeScript
Next.js (App Router)
Tesseract.js (OCR engine)
OpenAI GPT API (translation)
👨‍💻 Author
Built with ❤️ by Yoshi K

🇯🇵 Indie developer based in Japan
🛍️ Gumroad: yoshiverse1.gumroad.com
📬 Feedback & Contact
Feedback welcome! Open an issue or mention me on X/Twitter
I'm building solo — your support means a lot
📄 License
MIT License

You are free to use, modify, and distribute this software for personal or commercial purposes.

⚖️ License Notice (OCR Data)
This tool uses OCR language data from the official Tesseract project.

OCR models (jpn.traineddata, eng.traineddata, etc.) were downloaded from the tessdata repository, licensed under the Apache License 2.0.

OCR Engine: Tesseract OCR
Copyright © Google
