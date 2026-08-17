# QuickSub Draft

動画に焼き込まれた字幕をブラウザ上でOCR抽出し、OpenAI APIで翻訳して `.srt` / `.txt` として書き出せるWebアプリです。

動画編集の中で、字幕の書き起こしと多言語翻訳に時間がかかっていたことをきっかけに開発しました。

## Features

- 動画ファイルの読み込み
- 動画上で字幕領域を指定
- Tesseract.jsによるブラウザ内OCR
- OCR対象フレームの間隔調整
- OpenAI APIによる字幕翻訳
- 10言語への翻訳
- `.srt` / `.txt` 形式で書き出し
- 動画ファイル自体は外部サーバーへアップロードせずブラウザ内で処理

※ 翻訳時は抽出した字幕テキストをOpenAI APIへ送信します。

## Tech Stack

- Next.js
- React
- TypeScript
- Tesseract.js
- OpenAI API

## Technical Highlights

### Browser-based OCR

Tesseract.jsを利用し、動画から取得したフレームをブラウザ内でOCR処理しています。

### Subtitle Region Selection

Canvas上で字幕領域を指定し、必要な範囲に絞ってOCRできるようにしています。

### Image Preprocessing

OCR前にグレースケール化やコントラスト調整などの画像処理を行っています。

### SRT Export

OCR結果に動画の時間情報を付与し、SRT形式の字幕データを生成します。

## Project Structure

    app/
      page.tsx

    src/
      hooks/
        useOcrWorker.ts

    public/
      tessdata/

    package.json
    tsconfig.json

## Local Development

    npm install
    npm run dev

## How to Use

1. 動画ファイルを選択
2. 必要に応じて字幕領域を指定
3. OCR言語とフレーム間隔を設定
4. 字幕をOCR抽出
5. OpenAI APIキーを入力
6. 翻訳先言語を選択
7. `.srt` または `.txt` でダウンロード

## Development Background

動画編集をしている中で、映像に焼き込まれた字幕を手作業で書き起こし、さらに別言語へ翻訳する作業に手間がかかっていました。

そこで、

**動画 → OCR → 翻訳 → 字幕ファイル生成**

までを一つのWebアプリで完結できるようにすることを目的として開発しました。

## Author

Yoshi K  
Indie developer based in Japan
