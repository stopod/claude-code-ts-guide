# バックエンド開発ガイド

このディレクトリには、Node.js + TypeScriptを基盤としたバックエンド開発に特化したガイドが含まれています。

## バックエンド特化の目的

- **API設計の統一**: RESTful/GraphQL API設計パターン
- **データ層最適化**: データベース設計とORM活用
- **スケーラビリティ**: パフォーマンスと保守性の両立

## ガイド一覧（予定）

### プロジェクト設定
- **[Node.js + TypeScriptセットアップ](./node-typescript-setup.md)**: Express + Prisma初期設定
- **Express統合**: RESTful API フレームワーク設定
- **環境変数・設定管理**: 本番対応セキュリティ

### API設計
- **RESTful API設計パターン**: リソース設計とHTTPメソッド
- **GraphQL実装パターン**: スキーマ設計とResolver実装
- **API認証・認可**: JWT/OAuth実装パターン

### データベース統合
- **データベース設計**: PostgreSQL + Prismaスキーマ設計
- **Prisma統合**: TypeScript ORM活用パターン
- **マイグレーション戦略**: 安全なスキーマ変更管理

### バックエンドテスト
- **統合テスト**: API endpoint testing
- **データベーステスト**: Transaction & Rollback patterns
- **E2Eテスト**: Full-stack testing strategies

## 前提知識

バックエンド開発を始める前に、以下の共通ガイドを必ず読んでください：

### 必須の共通実践
- [開発ワークフローガイド](../shared/development-workflow.md)
- [関数型TypeScriptアーキテクチャガイド](../shared/functional-typescript-architecture.md)
- [テスト駆動開発ガイド](../shared/test-driven-development.md)

### 推奨の共通実践
- [Node.js + TypeScriptセットアップ](./node-typescript-setup.md)
- [コードクリーンアップ自動化ガイド](../shared/cleanup-automation.md)

## バックエンド開発フロー

### 1. プロジェクト初期化
```bash
# Node.js + Express + Prismaプロジェクト作成
mkdir my-backend-api && cd my-backend-api
npm init -y

# 開発ブランチ作成
git checkout -b feature/初期設定
```

### 2. 共通実践の適用
- Result型によるエラーハンドリング
- Repository Patternでのデータアクセス層
- TDDでのAPI開発

### 3. バックエンド特化実装
- Expressでのルーティング設計
- PrismaでのDB統合
- JWT認証の実装

## ⚡ バックエンド特化コマンド

### 開発・テスト
```bash
# 開発サーバー起動
npm run dev

# API統合テスト
npm run test:integration

# データベースリセット
npm run db:reset

# マイグレーション実行
npm run db:migrate
```

### ビルド・デプロイ
```bash
# 本番ビルド
npm run build

# Dockerイメージ作成
docker build -t my-api .

# 本番デプロイ
npm run deploy
```

## 🔧 バックエンド技術スタック

### コア技術
- **Node.js**: JavaScript runtime
- **TypeScript**: 型安全なJavaScript
- **Express**: RESTful API フレームワーク

### データベース
- **PostgreSQL**: メインデータベース
- **Prisma**: TypeScript ORM
- **Redis**: キャッシュ・セッション管理

### 認証・セキュリティ
- **JWT**: ステートレス認証
- **bcrypt**: パスワードハッシュ化
- **helmet**: セキュリティヘッダー

### テスト
- **Vitest**: テストフレームワーク
- **Supertest**: HTTP assertion library
- **Testcontainers**: 統合テスト用DB

### インフラ・デプロイ
- **Docker**: コンテナ化
- **Railway/Fly.io**: PaaS deployment
- **GitHub Actions**: CI/CD

## 🚫 バックエンド特化禁止事項

### セキュリティ
- ❌ 平文パスワードの保存
- ❌ SQL Injection脆弱性
- ❌ 機密情報のログ出力
- ❌ CORS設定の無視

### パフォーマンス
- ❌ N+1クエリ問題
- ❌ 不適切なインデックス設計
- ❌ メモリリークの放置

### データ整合性
- ❌ トランザクション処理の無視
- ❌ 不適切な楽観/悲観ロック
- ❌ データバリデーション不足

## 🔗 API設計の基本原則

### RESTful設計
- **リソース指向**: URIはリソースを表現
- **HTTPメソッド**: GET/POST/PUT/DELETE適切使用
- **ステータスコード**: 適切なレスポンス設定

### エラーハンドリング
- **Result型活用**: 型安全なエラー処理
- **構造化エラー**: 一貫したエラーレスポンス
- **ログ戦略**: 適切なレベルでのログ出力

### パフォーマンス
- **キャッシュ戦略**: Redis活用パターン
- **ページネーション**: 大量データ処理
- **非同期処理**: Queue/Worker pattern

## 🔗 関連ガイド

### 共通基盤
- [共通開発実践ガイド](../shared/README.md)

### フロントエンド連携
- [フロントエンド開発ガイド](../frontend/README.md)

---

**重要**: バックエンド開発は共通実践を基盤として、サーバーサイド特化の技術を積み上げる構造です。まず共通実践を習得し、その上でバックエンド特化技術を身につけてください。