# 開発ガイド集

このディレクトリには、Claude Codeが高品質な関数型TypeScriptアプリケーションを構築するための完全なガイドセットが含まれています。

## 🏗️ ガイド構成

開発ガイドは3つの領域に分かれており、**共通実践**を基盤として、**技術領域特化**の知識を積み上げる構造になっています。

### 📋 学習の進め方

1. **共通実践** (必須基盤) → 2. **技術領域特化** (フロント/バック) → 3. **実践応用**

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

## 🎯 開発者向けクイックスタート

### 新規プロジェクト開始時

1. **共通基盤の理解**
   - [共通実践ガイド](./shared/README.md) を読んで基本方針を理解

2. **技術領域選択とプロジェクト初期化**
   - **フロントエンド**: [React Router v7セットアップ](./frontend/react-router-v7-setup.md)
   - **バックエンド**: [Node.js + TypeScriptセットアップ](./backend/node-typescript-setup.md)
   - **フルスタック**: 両方の設定ガイドを参照

3. **開発実践**
   - [開発ワークフローガイド](./shared/development-workflow.md) に従って開発
   - [テスト駆動開発ガイド](./shared/test-driven-development.md) でTDD実践

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

### 関連ドキュメント
- `../development/`: 技術的な詳細仕様
- `../project/`: プロジェクト管理関連  
- `../../CLAUDE.md`: プロジェクト固有の指示

---

**重要**: これらのガイドは**段階的な学習設計**です。新しいClaude Codeセッションでは、必ず**共通実践から開始**し、技術領域特化ガイドに進んでください。品質の高いコードベースを維持するため、すべての指針を遵守することが必要です。