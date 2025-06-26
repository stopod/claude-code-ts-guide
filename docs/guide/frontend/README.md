# フロントエンド開発ガイド

このディレクトリには、React Router v7を基盤としたフロントエンド開発に特化したガイドが含まれています。

## フロントエンド特化の目的

- **React Router v7活用**: フレームワークモードの最大活用
- **UI/UX最適化**: コンポーネント設計とパフォーマンス
- **フロントエンド特化テスト**: Component/E2E/視覚回帰テスト

## ガイド一覧（予定）

### プロジェクト設定
- **React Router v7セットアップ**: フレームワークモード初期設定
- **shadcn-ui統合**: デザインシステム構築
- **状態管理戦略**: クライアントサイド状態設計

### コンポーネント設計
- **Reactパターン集**: 関数型Reactコンポーネント設計
- **コンポーネントアーキテクチャ**: 再利用可能な設計パターン
- **UI/UXテスト戦略**: Component testing & E2E testing

### パフォーマンス最適化
- **バンドル最適化**: Code splitting & Lazy loading
- **レンダリング最適化**: React performance patterns
- **キャッシュ戦略**: Client-side caching

## 前提知識

フロントエンド開発を始める前に、以下の共通ガイドを必ず読んでください：

### 必須の共通実践
- [開発ワークフローガイド](../shared/development-workflow.md)
- [関数型TypeScriptアーキテクチャガイド](../shared/functional-typescript-architecture.md)
- [テスト駆動開発ガイド](../shared/test-driven-development.md)

### 推奨の共通実践
- [React Router v7セットアップ](./react-router-v7-setup.md)
- [コードクリーンアップ自動化ガイド](../shared/cleanup-automation.md)

## フロントエンド開発フロー

### 1. プロジェクト初期化
```bash
# React Router v7プロジェクト作成
npx create-react-router@latest my-frontend-app
cd my-frontend-app

# 開発ブランチ作成
git checkout -b feature/初期設定
```

### 2. 共通実践の適用
- Result型によるエラーハンドリング
- TDDサイクルでのコンポーネント開発
- 関数型アプローチでの状態管理

### 3. フロントエンド特化実装
- React Router v7ルーティング設計
- shadcn-uiコンポーネント活用
- パフォーマンス最適化

## ⚡ フロントエンド特化コマンド

### 開発・テスト
```bash
# 開発サーバー起動
npm run dev

# コンポーネントテスト
npm test -- --ui

# E2Eテスト
npm run test:e2e

# Storybookでコンポーネント確認
npm run storybook
```

### ビルド・デプロイ
```bash
# 本番ビルド
npm run build

# ビルドサイズ分析
npm run analyze

# Static export
npm run export
```

## 🔧 フロントエンド技術スタック

### コア技術
- **React Router v7**: フルスタックフレームワーク
- **TypeScript**: 型安全なJavaScript
- **Tailwind CSS**: ユーティリティファーストCSS

### UI/UX
- **shadcn-ui**: 高品質UIコンポーネント
- **Lucide React**: アイコンライブラリ
- **class-variance-authority**: スタイルバリアント管理

### テスト
- **Vitest**: テストフレームワーク
- **Testing Library**: コンポーネントテスト
- **Playwright**: E2Eテスト

### 開発ツール
- **ESLint**: コード品質
- **Prettier**: コードフォーマット
- **Storybook**: コンポーネント開発環境

## 🚫 フロントエンド特化禁止事項

### パフォーマンス
- ❌ 大量の不要な再レンダリング
- ❌ バンドルサイズの無視
- ❌ 画像最適化の怠慢

### セキュリティ
- ❌ 機密情報のクライアントサイド露出
- ❌ XSS脆弱性のあるコンポーネント
- ❌ 不適切なCSP設定

### アクセシビリティ
- ❌ セマンティックHTML無視
- ❌ スクリーンリーダー対応不足
- ❌ キーボードナビゲーション無視

## 🔗 関連ガイド

### 共通基盤
- [共通開発実践ガイド](../shared/README.md)

### バックエンド連携
- [バックエンド開発ガイド](../backend/README.md)

---

**重要**: フロントエンド開発は共通実践を基盤として、UI/UX特化の技術を積み上げる構造です。まず共通実践を習得し、その上でフロントエンド特化技術を身につけてください。