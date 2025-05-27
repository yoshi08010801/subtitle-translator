# 🎬 QuickSub Draft — Extract & translate subtitles from any video (in your browser)

## ✅ ② Motivation（🧠 開発理由） 

```diff
A simple tool for indie creators, editors, and language learners.
+ I built this tool to solve my own YouTube workflow problem: translating hardcoded subtitles was extremely time-consuming.

A simple tool for indie creators, editors, and language learners.

👉 日本語の説明は下にあります / See below for Japanese 🇯🇵

---

## 🎥 Demo

[![Watch the demo](https://img.youtube.com/vi/0aX989tWoYQ/hqdefault.jpg)](https://youtu.be/0aX989tWoYQ)

A quick demo of how QuickSub Draft works.  
（日本語字幕付き：使い方の流れもわかります）

---

## 🌟 Features

- 🎥 Drag & drop your video (MP4, WebM, etc.)
- 🔲 Select subtitle region (optional)
- 🧠 OCR powered by Tesseract.js (runs locally)
- 🌍 Translate to 100+ languages via OpenAI GPT
- 💾 Export .srt or .txt subtitle files
- 🔒 100% local — your files stay on your device

---

## 🚀 How to Use

1. Upload your video  
2. (Optional) Draw a box around subtitle area  
3. Choose OCR language (e.g., English, Japanese)  
4. Choose translation language  
5. Click ▶ Extract OCR  
6. Enter your OpenAI API key  
7. Click ▶ Translate  
8. Download subtitles as .srt or .txt  

---

## 🧰 Requirements

- Chrome, Safari, Edge, Firefox  
- Internet connection (for translation)  
- Your own [OpenAI API key](https://platform.openai.com/account/api-keys)  

---

## 📦 Includes

- Full source code (React + Next.js)  
- `.env.template`, `README.md`  
- MIT License — for personal & commercial use  

---
---

## 🔄 Internal Flow

```plaintext
🎥 動画アップロード（MP4/WebM）
   ↓
📐 canvasで1フレーム画像を取得
   ↓
🔎 Tesseract.jsでOCR処理（ローカル動作）
   ↓
🧹 テキストを整形（改行除去・正規表現）
   ↓
🌐 OpenAI GPT-4o で翻訳（多言語対応）
   ↓
📁 .srt / .txt 形式で字幕ファイルを書き出し


## ❗ Disclaimer

Subtitle accuracy is not 100% guaranteed.  
OCR and translation quality may vary depending on the video.  
This tool is for **quick subtitle drafts** — always review and edit.

---

## 🛠 Built with ❤️ by Yoshi K in Japan  
🔗 [yoshiverse1.gumroad.com](https://yoshiverse1.gumroad.com)

---

<details>
<summary>🇯🇵 日本語の説明はこちら</summary>

> このツールは、自分自身がYouTubeで字幕を翻訳する際に  
> 「映像に焼き込まれた字幕を抽出して翻訳するのが面倒」という悩みから開発しました。

<br>

🎬 **QuickSub Draft — 動画の字幕をブラウザで抽出＆翻訳**

クリエイター・編集者・語学学習者のためのシンプルなツールです。

---

### 🌟 特徴

- 🎥 動画をドラッグ＆ドロップ（MP4, WebM対応）  
- 🔲 字幕エリアを手動で選択（任意）  
- 🧠 Tesseract.jsでローカルOCR処理  
- 🌍 GPTで100言語以上に翻訳  
- 💾 SRT / TXTファイルで字幕書き出し  
- 🔒 完全ローカル処理（ファイルは端末内のみ）  

---

### 🚀 使い方

1. 動画をアップロード  
2. （任意）字幕エリアを囲む  
3. OCR言語を選択（例：日本語、英語）  
4. 翻訳言語を選ぶ  
5. ▶ 抽出ボタンでOCR開始  
6. OpenAI APIキーを入力  
7. ▶ 翻訳ボタンで翻訳開始  
8. 字幕ファイル（.srt または .txt）を保存  

---

### 🧰 必要なもの

- Chrome, Safari, Edge, Firefox  
- インターネット接続（翻訳時）  
- [OpenAI APIキー](https://platform.openai.com/account/api-keys)  

---

### 📦 同梱内容

- フルソースコード（React + Next.js）  
- `.env.template`, `README.md`  
- MITライセンス（個人・商用利用OK）  

---

### ❗ 免責事項

抽出や翻訳の精度は100%ではありません。  
本ツールは **素早くドラフト字幕を作るための支援ツール** です。  
最終的な字幕は必ず確認・編集をお願いします。

---

### 🛠 開発者

日本在住のYoshi Kが開発しました。  
🔗 [yoshiverse1.gumroad.com](https://yoshiverse1.gumroad.com)

</details>

---

## 🧑‍💻 Developer Notes

- フロントは Next.js + Tailwind CSS（もしくは shadcn/ui）で構築
- canvas を使って動画の一部をフレーム画像として抽出
- Tesseract.js で OCR をローカル処理（APIレスポンスなしで高速）
- GPT-4o を使った多言語翻訳。APIキーはユーザー入力式
- 翻訳された字幕データは SRT/TXT形式で整形して保存可能
- 字幕書き出しは `00:00:00,000` 形式のタイムスタンプ付きで自動出力

## ⚖️ License Notes

This app uses OCR models from the [Tesseract project](https://github.com/tesseract-ocr/tessdata), licensed under the Apache License 2.0.

---

## ⚖️ ライセンスに関する注記

本アプリでは、[Tesseract プロジェクト](https://github.com/tesseract-ocr/tessdata) のOCRモデルを利用しています（Apache License 2.0 に準拠）。
