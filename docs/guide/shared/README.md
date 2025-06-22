# 共通開発実践ガイド

このディレクトリには、フロントエンド・バックエンドを問わず、すべてのTypeScript開発で共通して適用される基盤的なガイドが含まれています。

## 🎯 共通実践の目的

- **一貫性の確保**: プロジェクト全体での開発手法統一
- **品質の標準化**: コード品質とテスト戦略の共通基盤
- **開発効率の向上**: 実証済みのベストプラクティス活用

## 📚 ガイド一覧

### 🚀 [開発ワークフローガイド](./development-workflow.md)
- **目的**: 開発プロセス全体の標準化
- **内容**: Git戦略、TDDサイクル、コミット規約、品質チェック
- **適用**: すべての開発作業で必須

### 🏗️ [関数型TypeScriptアーキテクチャガイド](./functional-typescript-architecture.md)
- **目的**: アーキテクチャ設計の統一
- **内容**: Result型、Repository Pattern、関数型Service層
- **適用**: 新機能実装時、リファクタリング時

### 🧪 [テスト駆動開発ガイド](./test-driven-development.md)
- **目的**: 品質保証とテスト戦略の統一
- **内容**: TDDサイクル、日本語テストケース記述、Result型テスト
- **適用**: 全機能実装時（絶対遵守）

### 🔧 [コードクリーンアップ自動化ガイド](./cleanup-automation.md)
- **目的**: 既存プロジェクトの品質向上
- **内容**: 段階的改善手法、自動化ツール活用、品質メトリクス
- **適用**: 既存プロジェクトの改善時

### 📋 [プロジェクト設定テンプレート](./project-setup-template.md)
- **目的**: 新規プロジェクトの即座立ち上げ
- **内容**: 設定ファイル、ディレクトリ構造、必須コンポーネント
- **適用**: プロジェクト初期化時

## 🎯 学習の進め方

### 新規プロジェクト開始時
1. **[プロジェクト設定テンプレート](./project-setup-template.md)** を読んで初期設定
2. **[開発ワークフローガイド](./development-workflow.md)** を読んで開発プロセスを理解
3. **[関数型TypeScriptアーキテクチャガイド](./functional-typescript-architecture.md)** を読んで設計方針を把握
4. **[テスト駆動開発ガイド](./test-driven-development.md)** を読んでTDD手法を確認

### 既存プロジェクト改善時
1. **[コードクリーンアップ自動化ガイド](./cleanup-automation.md)** を読んで段階的改善を実施
2. **[開発ワークフローガイド](./development-workflow.md)** に従って開発プロセスを標準化
3. 新機能は **[関数型TypeScriptアーキテクチャガイド](./functional-typescript-architecture.md)** に完全準拠

### 日常開発時
1. **[開発ワークフローガイド](./development-workflow.md)** の手順を厳守
2. **[テスト駆動開発ガイド](./test-driven-development.md)** のTDDサイクルを実践
3. **[関数型TypeScriptアーキテクチャガイド](./functional-typescript-architecture.md)** の設計パターンを適用

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

## 🔗 関連ガイド

### フロントエンド特化
- [フロントエンド開発ガイド](../frontend/README.md)

### バックエンド特化
- [バックエンド開発ガイド](../backend/README.md)

---

**重要**: これらの共通実践は、フロントエンド・バックエンドを問わず、すべてのTypeScript開発の基盤となります。まず共通実践を習得してから、各技術領域特化のガイドに進んでください。