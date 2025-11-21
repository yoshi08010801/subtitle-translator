# Ultra Subtitle Translator

Extract and translate subtitles from any video — right in your browser.  
Perfect for indie creators, editors, and language learners.

---

## Features

- Drag & drop your video (MP4, WebM, etc.)
- Select subtitle region (optional)
- OCR powered by Tesseract.js (runs locally in your browser)
- Translate subtitles into up to 10 preset languages via OpenAI GPT
- Export `.srt` or `.txt` subtitle files
- 100% local — video never leaves your browser

---

## How to Use

1. Upload or drag-drop your video  
2. (Optional) Draw a box around the subtitle area  
3. Choose the OCR language (e.g., English, Japanese)  
4. Choose the translation language (from the 10 supported options)  
5. Click “Extract OCR”  
6. Enter your OpenAI API key  
7. Click “Translate”  
8. Download subtitles as `.srt` or `.txt`  

---

## Requirements

- Modern browser (Chrome, Edge, Firefox, Safari)
- Internet connection (for translation)
- Your own OpenAI API key

---

## Project Structure

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

---

## Local Development

npm install  
npm run dev  

To export as static files:  

npm run build  
npx next export  

Deploy the `out/` folder to GitHub Pages, Netlify, or Vercel.

---

## Static Export Setup (Next.js 13+)

// next.config.js  
const nextConfig = {  
  output: "export",  
  images: { unoptimized: true },  
};  
module.exports = nextConfig;

---

## Tech Stack

- React + TypeScript
- Next.js (App Router)
- Tesseract.js (OCR engine)
- OpenAI GPT API (translation)

---

## Author

Built by **Yoshi K**  

- Indie developer based in Japan  
- Gumroad: https://yoshiverse1.gumroad.com  

---

## Feedback & Contact

- Feedback is welcome — open an issue or mention me on X/Twitter  
- I am building this solo, so your support and suggestions are very helpful  

---

## License

MIT License  

You are free to use, modify, and distribute this software for personal or commercial purposes.

---

## License Notice (OCR Data)

This tool uses OCR language data from the official Tesseract project.

OCR models (`jpn.traineddata`, `eng.traineddata`, etc.) were downloaded from the tessdata repository, licensed under the Apache License 2.0.

<details>
<summary><strong>Japanese README（クリックで開閉）</strong></summary>

<br>

# Ultra Subtitle Translator（日本語版）

ブラウザだけで動画から字幕を抽出して翻訳できるツールです。  
インディークリエイター、動画編集者、語学学習者向けに作られています。

---

## 特長

- 動画ファイルをドラッグ＆ドロップ（MP4, WebM など）
- 字幕の表示領域をマウスで選択（任意）
- ブラウザ内で動作する Tesseract.js による OCR（ローカル実行）
- OpenAI GPT を使って、最大 10 言語まで翻訳
- `.srt` または `.txt` 形式で字幕を書き出し
- 動画ファイルはブラウザ外に送信されないローカル処理

---

## 使い方

1. 画面に動画ファイルをアップロード、またはドラッグ＆ドロップ  
2. （任意）動画上で字幕部分をドラッグして範囲指定  
3. OCR 言語を選択（例: 英語 / 日本語）  
4. 翻訳先の言語を 10 種類の中から選択  
5. `Extract OCR` をクリックして字幕テキストを抽出  
6. OpenAI API キーを入力  
7. `Translate` をクリックして翻訳を実行  
8. `.srt` もしくは `.txt` 形式で字幕ファイルをダウンロード  

---

## 動作環境

- モダンブラウザ（Chrome, Edge, Firefox, Safari）
- インターネット接続（翻訳 API 用）
- ユーザー自身の OpenAI API キー  
  （取得先: https://platform.openai.com/account/api-keys）

---

## プロジェクト構成

    subtitle-ui/
    ├── app/
    │   ├── page.tsx         # メイン UI
    │   ├── components/      # UI コンポーネント
    │   ├── hooks/           # useOcrWorker など
    │   ├── globals.css      # スタイル
    ├── public/
    │   └── demo.png         # サンプルスクリーンショット（任意）
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js       # Static export 用設定

---

## ローカル開発

    npm install
    npm run dev

静的ファイルとして書き出す場合:

    npm run build
    npx next export

生成された `out/` フォルダを GitHub Pages / Netlify / Vercel などにデプロイしてください。

---

## 静的書き出し設定（Next.js 13+）

    // next.config.js
    const nextConfig = {
      output: "export",
      images: { unoptimized: true },
    };
    module.exports = nextConfig;

---

## 技術スタック

- React + TypeScript
- Next.js（App Router）
- Tesseract.js（OCR エンジン）
- OpenAI GPT API（翻訳）

---

## 作者

**Yoshi K**

- 日本在住のインディー開発者  
- Gumroad: https://yoshiverse1.gumroad.com  

---

## フィードバック・連絡先

- 不具合報告や要望は GitHub Issues または X/Twitter でお知らせください  
- 一人で開発しているため、フィードバックや応援が次のアップデートの原動力になります  

---

## ライセンス

MIT License  

個人・商用問わず、自由に利用・改変・再配布することができます。

---

## OCR データのライセンスについて

本ツールは公式 Tesseract プロジェクトが提供する OCR 言語データを利用しています。

`jpn.traineddata`, `eng.traineddata` などの OCR モデルは  
[tessdata リポジトリ](https://github.com/tesseract-ocr/tessdata) からダウンロードしており、  
Apache License 2.0 のもとで配布されています。

</details>

