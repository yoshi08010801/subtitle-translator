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

※ 翻訳時はOCRで抽出した字幕テキストをOpenAI APIへ送信します。

## Tech Stack

- Next.js
- React
- TypeScript
- Tesseract.js
- Canvas API
- OpenAI API

## Architecture

画面全体の状態管理とOCR処理を `app/page.tsx` で行いながら、
再利用しやすい処理やUIを段階的に分離しています。

### Main responsibilities

- `app/page.tsx`
  - 動画ファイル管理
  - 字幕領域選択
  - Canvas操作
  - OCR実行
  - 翻訳処理
  - アプリ全体の状態管理

- `app/components/SubtitlePreview.tsx`
  - OCR / 翻訳結果のプレビュー
  - Original / Translated の切り替え
  - APIキー入力
  - 翻訳・ダウンロード操作

- `src/hooks/useOcrWorker.ts`
  - Tesseract.js Workerの生成・管理

- `src/lib/subtitle.ts`
  - 字幕データ型
  - OCR / 翻訳言語定義
  - SRT用タイムコード生成
  - SRT文字列生成

## Technical Highlights

### Browser-based OCR

Tesseract.jsを利用し、動画から取得したフレームをブラウザ内でOCR処理しています。

動画ファイルそのものをOCR用サーバーへ送信せず、ブラウザ上でフレーム取得と文字認識を行う構成にしています。

### Subtitle Region Selection

Canvas上で字幕領域をドラッグして指定できるようにしています。

動画全体ではなく必要な範囲だけをOCR対象にすることで、字幕以外の文字を認識する可能性を減らしています。

### Frame Sampling

動画を一定間隔でシークし、各フレームから字幕画像を取得してOCRを実行しています。

フレーム間隔はUIから変更できます。

### Image Preprocessing

OCR前にCanvas上で画像の前処理を行っています。

- Blur
- Contrast
- Brightness
- Grayscale補正

OCRしやすい画像へ加工してからTesseract.jsへ渡しています。

### SRT Generation

OCRした字幕に動画の時間情報を付与し、

`HH:MM:SS,mmm`

形式のタイムコードを生成して `.srt` データとして書き出します。

### Translation

OCR結果をOpenAI APIへ送信し、指定した言語へ翻訳します。

翻訳後はOriginal / Translatedを切り替えて確認でき、翻訳結果も `.srt` / `.txt` として出力できます。

## Refactoring

初期実装では、OCR・状態管理・表示処理を優先して `app/page.tsx` にまとめて実装していました。

機能が増えたことで責務が大きくなってきたため、段階的にリファクタリングしています。

今回の整理では、

- 字幕型と言語定義を `src/lib/subtitle.ts` へ分離
- SRT生成処理を `src/lib/subtitle.ts` へ分離
- プレビューUIを `SubtitlePreview` コンポーネントへ分離
- Tesseract.js Worker管理をCustom Hookとして管理

という形で、UI・共通ロジック・OCR Worker管理の責務を分けています。

## Project Structure

    app/
      api/
        ocr/
          route.ts
        save-json/
          route.ts
      components/
        SubtitlePreview.tsx
        VideoUploader.tsx
      page.tsx

    components/
      ErrorBoundary.tsx

    src/
      hooks/
        useOcrWorker.ts
      lib/
        subtitle.ts

    public/
      tessdata/

    package.json
    tsconfig.json

## Local Development

    npm install
    npm run dev

Production build:

    npm run build

## How to Use

1. 動画ファイルを選択
2. 必要に応じて字幕領域を指定
3. OCR言語とフレーム間隔を設定
4. 字幕をOCR抽出
5. 翻訳先言語を選択
6. OpenAI APIキーを入力
7. 翻訳を実行
8. Original / Translatedを確認
9. `.srt` または `.txt` でダウンロード

## Development Background

動画編集をしている中で、映像に焼き込まれた字幕を手作業で書き起こし、さらに別言語へ翻訳する作業に手間がかかっていました。

そこで、

**動画 → OCR → 翻訳 → 字幕ファイル生成**

までを一つのWebアプリで完結できるようにすることを目的として開発しました。

まず動作するMVPを作成し、その後OCR精度改善、字幕領域指定、翻訳、SRT出力などを追加しています。

現在は機能追加だけでなく、責務分離や可読性を意識したリファクタリングも進めています。

## Future Improvements

- OCR処理を専用Service / Hookへさらに分離
- Canvasによる字幕領域選択処理のコンポーネント化
- `page.tsx` の責務をさらに分割
- OCR中の進捗表示
- OCR結果の重複字幕統合
- OCR / SRT生成ロジックのUnit Test追加
- UI Component Testの追加
- エラーハンドリングの改善
- 翻訳API呼び出しをサーバー側へ移行
- APIキーをクライアント側で直接扱わない構成への改善

## Security Note

現在のMVPでは、ユーザーが入力したOpenAI APIキーをブラウザからOpenAI APIへのリクエストに利用しています。

本番サービスとして運用する場合は、API呼び出しをサーバー側へ移し、APIキーをクライアント側で直接扱わない構成へ変更する想定です。

## Author

Yoshi K  
Indie developer based in Japan
