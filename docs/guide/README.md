# 開発ガイド集

このディレクトリには、Claude Codeが高品質な関数型TypeScriptアプリケーションを構築するための完全なガイドセットが含まれています。

## 🏗️ ガイド構成

開発ガイドは3つの領域に分かれており、**共通実践**を基盤として、**技術領域特化**の知識を積み上げる構造になっています。

### 📋 Claude Code向け実行順序

**Claude Codeは以下の順序で必ず読み進めてください**:

1. **Phase 1: 共通基盤理解** (必須)
   - [共通実践ガイド](./shared/README.md) → [開発ワークフロー](./shared/development-workflow.md)
   
2. **Phase 2: 技術領域選択** (プロジェクトに応じて)
   - **フロントエンド**: [React Router v7セットアップ](./frontend/react-router-v7-setup.md)
   - **バックエンド**: [Node.js + TypeScriptセットアップ](./backend/node-typescript-setup.md)
   
3. **Phase 3: 設計パターン習得** (開発中継続参照)
   - [関数型TypeScriptアーキテクチャ](./shared/functional-typescript-architecture.md)
   - [テスト駆動開発](./shared/test-driven-development.md)

## 📚 共通開発実践 (すべての開発者必読)

### 🚀 [共通実践ガイド](./shared/README.md)
すべてのTypeScript開発で共通して適用される基盤的なガイド集です。

#### 主要ガイド
- **[開発ワークフローガイド](./shared/development-workflow.md)**: Git戦略、TDDサイクル、コミット規約
- **[関数型TypeScriptアーキテクチャガイド](./shared/functional-typescript-architecture.md)**: Result型、Repository Pattern、関数型Service層
- **[テスト駆動開発ガイド](./shared/test-driven-development.md)**: TDDサイクル、日本語テストケース記述
- **[コードクリーンアップ自動化ガイド](./shared/cleanup-automation.md)**: 段階的改善手法、品質メトリクス
- **プロジェクト設定**: フロント/バック別の初期設定ガイド

## 🎨 フロントエンド特化実践

### 🖥️ [フロントエンド開発ガイド](./frontend/README.md)
React Router v7を基盤としたフロントエンド開発に特化したガイド集です。

#### 対象技術
- **React Router v7**: フレームワークモード活用
- **shadcn-ui**: デザインシステム構築
- **Component Testing**: React Testing Library
- **Performance**: Bundle最適化、レンダリング最適化

## 🔧 バックエンド特化実践

### ⚙️ [バックエンド開発ガイド](./backend/README.md)
Node.js + TypeScriptを基盤としたバックエンド開発に特化したガイド集です。

#### 対象技術
- **Node.js + TypeScript**: サーバーサイド開発
- **Express**: RESTful API フレームワーク
- **Prisma**: TypeScript ORM
- **API Testing**: 統合テスト、E2Eテスト

## 🎯 Claude Code向けクイックスタート

### 新規プロジェクト開始時（実行必須手順）

**Claude Codeは以下を順番に実行してください**:

```bash
# Step 1: 基盤理解（必須読み込み）
@docs/guide/shared/README.md
@docs/guide/shared/development-workflow.md

# Step 2: プロジェクト初期化（技術選択）
# フロントエンドの場合:
@docs/guide/frontend/react-router-v7-setup.md

# バックエンドの場合:
@docs/guide/backend/node-typescript-setup.md

# Step 3: 開発開始前の必須設定
git checkout -b feature/機能名
npm install
npm run typecheck && npm test && npm run lint
```

### 開発中の必須参照順序

1. **設計判断時**: [関数型TypeScriptアーキテクチャ](./shared/functional-typescript-architecture.md)
2. **テスト作成時**: [テスト駆動開発ガイド](./shared/test-driven-development.md)
3. **リファクタリング時**: [コードクリーンアップ自動化](./shared/cleanup-automation.md)

### 既存プロジェクト改善時

1. **品質診断**: [コードクリーンアップ自動化ガイド](./shared/cleanup-automation.md)
2. **段階的改善**: 共通実践の段階的導入
3. **技術領域最適化**: フロント/バック特化ガイドの適用

### 日常開発時

1. **ワークフロー**: [開発ワークフローガイド](./shared/development-workflow.md) 厳守
2. **TDD実践**: [テスト駆動開発ガイド](./shared/test-driven-development.md) サイクル
3. **設計適用**: [関数型TypeScriptアーキテクチャガイド](./shared/functional-typescript-architecture.md) パターン

## ⚡ クイックリファレンス

### 必須実行コマンド

```bash
# 開発開始前の必須チェック
npm run typecheck && npm test && npm run lint && npm run build

# 新機能ブランチ作成
git checkout -b feature/機能名

# TDDサイクル
npm test -- --watch  # 常時実行推奨

# 品質チェック（コミット前必須）
npm run typecheck && npm test && npm run lint
```

### 絶対禁止事項

- ❌ テストなしの実装
- ❌ `git push` の実行  
- ❌ 英語でのテストケース記述
- ❌ Result型を使わないエラーハンドリング

### 推奨パターン

- ✅ Result<T, E>による型安全なエラーハンドリング
- ✅ Repository Patternによるデータアクセス層抽象化
- ✅ 純粋関数でのビジネスロジック実装
- ✅ テストファーストの関数型TDD

## 🔄 ガイド特徴

### 実証済みアプローチ
- **実際のプロジェクトで検証済み**: 全ての手法は実践で確認
- **実用性重視**: 理論よりも実際の開発効率を優先
- **Claude Code最適化**: Claude Codeが理解・実行しやすい形式

### 段階的学習設計
- **基盤→応用**: 共通実践から技術特化への段階構成
- **選択的学習**: 必要な技術領域のみ集中学習可能
- **相互参照**: 領域間の知識連携を明確化

## 📞 サポート・トラブルシューティング

### 問題解決の流れ
1. **該当ガイド内**の「🚨 トラブルシューティング」セクション確認
2. **共通実践**での解決策検索
3. **技術領域特化**での詳細解決策確認

### 新しく追加されたガイド
- **[フルスタック統合ガイド](./fullstack-integration-guide.md)**: React Router v7 + Express完全統合
- **[実践的TDD実装ガイド](./practical-tdd-implementation.md)**: 具体的なコード例によるTDD実践
- **[統一設定テンプレート](./shared/templates/README.md)**: ESLint、Prettier、TypeScript統一設定

### 完全実装例
- **[Result型完全実装](./shared/templates/implementations/result.ts)**: エラーハンドリング完全版
- **[Repository Pattern完全実装](./shared/templates/implementations/repository-pattern.ts)**: データアクセス層完全版

### 関連ドキュメント
- `../ts-guide/`: TypeScript技術的な詳細仕様
- `../../README.md`: プロジェクト全体の概要
- `../../CLAUDE.md`: プロジェクト固有の指示

---

**重要**: これらのガイドは**段階的な学習設計**です。新しいClaude Codeセッションでは、必ず**共通実践から開始**し、技術領域特化ガイドに進んでください。品質の高いコードベースを維持するため、すべての指針を遵守することが必要です。