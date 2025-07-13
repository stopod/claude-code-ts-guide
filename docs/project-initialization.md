# プロジェクト初期設定統合ガイド

## 概要

新規プロジェクト開始時の0→1フェーズで使用する統合ガイドです。環境構築、プロジェクト構造設定、初期企画から実装開始までの全工程を網羅します。

## プロジェクト企画・要件整理

### 1. プロジェクト目的の明確化

#### 実施すべき項目
- **解決したい課題の定義**
  - 現在の問題点
  - 問題の影響範囲
  - 解決の緊急度
  
- **成功指標の設定**
  - 定量的な目標（パフォーマンス、利用者数など）
  - 定性的な目標（ユーザビリティ、保守性など）

#### 要件定義テンプレート活用

以下の要素を必ず整理してください：

```markdown
## プロジェクト基本情報
- プロジェクト名: [具体的な名称]
- 概要: [1-2段落で目的と概要]
- 開発期間: [開始〜完了予定日]

## 機能要件
### 必須機能（MVP）
- [機能1]: [詳細と受け入れ条件]
- [機能2]: [詳細と受け入れ条件]

### 拡張機能（段階的実装）
- フェーズ2: [機能リスト]
- フェーズ3: [機能リスト]

## 非機能要件
- パフォーマンス: [応答時間、スループット]
- セキュリティ: [認証・認可・データ保護]
- ユーザビリティ: [対象ユーザー、使いやすさ]

## 技術要件
- 技術スタック: [フロント・バック・DB・インフラ]
- 技術的制約: [既存システム連携、互換性]
```

### 2. 企画チェックリスト

プロジェクト開始前に以下を必ず確認：

#### 問題・課題の明確化
- [ ] 解決したい問題が具体的に定義されている
- [ ] 問題の影響範囲が明確
- [ ] 問題解決の緊急度・重要度が評価されている

#### 機能要件
- [ ] 必須機能（MVP）が明確に定義されている
- [ ] 各機能の受け入れ条件が具体的に記述されている
- [ ] 機能の優先順位が設定されている
- [ ] スコープ外の機能が明確に定義されている

#### 技術検討
- [ ] 技術スタック選択の根拠が明確
- [ ] システム全体のアーキテクチャが設計されている
- [ ] 技術的実現可能性が検証されている
- [ ] パフォーマンス要件の実現可能性が確認されている

## プロジェクト構造テンプレート

### 1. フルスタック Web アプリケーション

```
my-fullstack-app/
├── frontend/                 # React Router v7 アプリ
│   ├── public/
│   ├── src/
│   │   ├── components/       # 再利用可能なUIコンポーネント
│   │   │   ├── ui/          # 基本UIコンポーネント
│   │   │   ├── forms/       # フォームコンポーネント
│   │   │   └── layout/      # レイアウトコンポーネント
│   │   ├── pages/           # ページコンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── services/        # API通信・外部サービス
│   │   ├── stores/          # 状態管理
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── types/           # TypeScript型定義
│   │   └── __tests__/       # テストファイル
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API エンドポイント
│   │   ├── services/        # ビジネスロジック
│   │   ├── repositories/    # データアクセス層
│   │   ├── models/          # データモデル
│   │   ├── middleware/      # 認証・バリデーション等
│   │   ├── config/          # 設定ファイル
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── types/           # TypeScript型定義
│   │   └── __tests__/       # テストファイル
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # プロジェクトドキュメント
│   ├── api-specification.md # API仕様書
│   ├── database-schema.md   # データベース設計
│   └── deployment.md        # デプロイメント手順
├── scripts/                  # 開発・運用スクリプト
├── compose.yaml             # Docker開発環境
├── package.json             # ワークスペース設定
└── README.md
```

**この構造の利点**:
- ✅ frontend/backend が完全独立（デプロイ時に依存関係なし）
- ✅ 各アプリが独自の package.json を持つ
- ✅ Vercel、Railway 等へのデプロイが簡単
- ✅ CI/CD パイプラインが複雑にならない

### 2. バックエンド API 単体

```
my-backend-api/
├── src/
│   ├── controllers/         # API エンドポイント
│   ├── services/           # ビジネスロジック
│   ├── repositories/       # データアクセス
│   ├── models/             # データモデル
│   ├── middleware/         # 認証・バリデーション等
│   ├── config/             # 設定ファイル
│   ├── utils/              # ユーティリティ
│   ├── types/              # TypeScript型定義
│   └── __tests__/          # テストファイル
├── docs/api-specification.md
├── Dockerfile
├── package.json
└── tsconfig.json
```

### 3. フロントエンド SPA 単体

```
my-frontend-app/
├── public/
├── src/
│   ├── components/         # UIコンポーネント
│   ├── pages/             # ページコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── services/          # API通信
│   ├── stores/            # 状態管理
│   ├── utils/             # ユーティリティ
│   ├── types/             # TypeScript型定義
│   └── __tests__/         # テストファイル
├── package.json
└── tsconfig.json
```

## 技術環境セットアップ

### Phase 1: プロジェクト初期化

#### フルスタック統合プロジェクト

```bash
# 1. プロジェクト作成
mkdir my-fullstack-app
cd my-fullstack-app

# 2. ワークスペース初期化
npm init -y

# 3. ワークスペース設定
# package.json に追加:
{
  \"workspaces\": [\"frontend\", \"backend\"]
}

# 4. フロントエンド作成
npx create-react-router@latest frontend

# 5. バックエンド作成
mkdir backend
cd backend
npm init -y
```

#### バックエンド API 環境構築

```bash
# 1. プロジェクト作成
mkdir my-backend-api
cd my-backend-api
npm init -y

# 2. TypeScript環境構築
npm install -D typescript @types/node ts-node nodemon
npm install -D @types/express

# 3. Express本体
npm install express

# 4. TypeScript設定
npx tsc --init

# 5. Prisma ORM
npm install prisma @prisma/client
npm install -D prisma

# 6. セキュリティ・ミドルウェア
npm install helmet cors dotenv
npm install -D @types/cors

# 7. バリデーション
npm install zod

# 8. テスト環境
npm install -D vitest supertest @types/supertest

# 9. コード品質ツール
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

#### フロントエンド環境構築

```bash
# 1. React Router v7 プロジェクト作成
npx create-react-router@latest my-frontend-app
cd my-frontend-app

# 2. 追加依存関係
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react

# 3. 開発・品質ツール
npm install -D @types/react @types/react-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Phase 2: 設定ファイル構成

#### 必須設定ファイル

##### `tsconfig.json` (共通)
```json
{
  \"compilerOptions\": {
    \"target\": \"ES2022\",
    \"lib\": [\"ES2022\"],
    \"module\": \"ESNext\",
    \"moduleResolution\": \"bundler\",
    \"strict\": true,
    \"esModuleInterop\": true,
    \"skipLibCheck\": true,
    \"forceConsistentCasingInFileNames\": true,
    \"allowSyntheticDefaultImports\": true,
    \"resolveJsonModule\": true,
    \"isolatedModules\": true,
    \"noEmit\": true,
    \"declaration\": true,
    \"declarationMap\": true,
    \"sourceMap\": true
  }
}
```

##### `package.json` スクリプト設定

**フルスタック（ルート）**:
```json
{
  \"scripts\": {
    \"dev\": \"concurrently \\\"npm run dev -w frontend\\\" \\\"npm run dev -w backend\\\"\",
    \"build\": \"npm run build -w frontend && npm run build -w backend\",
    \"test\": \"npm run test -w frontend && npm run test -w backend\",
    \"lint\": \"npm run lint -w frontend && npm run lint -w backend\",
    \"typecheck\": \"npm run typecheck -w frontend && npm run typecheck -w backend\"
  }
}
```

**バックエンド**:
```json
{
  \"scripts\": {
    \"dev\": \"nodemon --exec ts-node src/index.ts\",
    \"build\": \"tsc\",
    \"start\": \"node dist/index.js\",
    \"test\": \"vitest\",
    \"test:watch\": \"vitest --watch\",
    \"lint\": \"eslint src/**/*.ts\",
    \"lint:fix\": \"eslint src/**/*.ts --fix\",
    \"typecheck\": \"tsc --noEmit\"
  }
}
```

**フロントエンド**:
```json
{
  \"scripts\": {
    \"dev\": \"vite dev\",
    \"build\": \"vite build\",
    \"start\": \"vite preview\",
    \"test\": \"vitest\",
    \"test:watch\": \"vitest --watch\",
    \"lint\": \"eslint src/**/*.{ts,tsx}\",
    \"lint:fix\": \"eslint src/**/*.{ts,tsx} --fix\",
    \"typecheck\": \"tsc --noEmit\"
  }
}
```

### Phase 3: 開発環境確認

#### 環境セットアップ完了チェック

```bash
# 1. 依存関係インストール確認
npm install

# 2. TypeScript型チェック
npm run typecheck

# 3. テスト実行（初期状態で全パス確認）
npm test

# 4. リント実行
npm run lint

# 5. ビルド確認
npm run build

# 6. 開発サーバー起動テスト
npm run dev
```

すべてのコマンドが正常に実行されることを確認してから開発を開始してください。

## Docker 開発環境（オプション）

### compose.yaml 設定

```yaml
services:
  app:
    build: .
    ports:
      - \"3000:3000\"    # フロントエンド
      - \"8000:8000\"    # バックエンド
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - \"5432:5432\"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 初期実装の方針

### 1. 環境確認後の開発開始手順

1. **機能ブランチ作成**: `feature/initial-setup`
2. **基本構造実装**: ヘルスチェックエンドポイント
3. **テスト環境確認**: 最小限のテストケース
4. **CI/CD パイプライン**: GitHub Actions 設定
5. **デプロイ準備**: 本番環境への初回デプロイ

### 2. 最初に実装すべき機能

#### バックエンド
- ヘルスチェックエンドポイント (`GET /health`)
- CORS・セキュリティミドルウェア設定
- エラーハンドリングミドルウェア
- 基本的なログ出力設定

#### フロントエンド
- ルーティング設定
- レイアウトコンポーネント
- API 通信の基本設定
- エラーバウンダリ実装

### 3. 品質確保の初期設定

- **ESLint/Prettier**: コードフォーマット統一
- **Husky**: Git フック設定
- **lint-staged**: コミット前チェック
- **GitHub Actions**: CI/CD パイプライン

## 関連ドキュメント

- [Claude Code 実行ガイド](./claude-execution.md): 開発時の必須ルール・手順
- [継続的改善ガイド](./continuous-improvement.md): 長期的な品質向上とアーキテクチャ設計

---

**重要**: プロジェクト開始前にこのガイドの内容を確実に実行し、すべての環境チェックがパスすることを確認してから開発を開始してください。