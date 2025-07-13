# プロジェクト構造テンプレート

## 概要

Claude Code と協働する際の標準的なプロジェクト構造テンプレートを提供します。プロジェクトの性質に応じて適切なテンプレートを選択してください。

## テンプレート一覧

### 1. フルスタック Web アプリケーション

```
my-fullstack-app/
├── frontend/                 # React アプリケーション
│   ├── public/
│   ├── src/
│   │   ├── components/       # 再利用可能なUIコンポーネント
│   │   ├── pages/           # ページコンポーネント
│   │   ├── hooks/           # カスタムフック
│   │   ├── services/        # API通信・外部サービス
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── types/           # TypeScript型定義
│   │   └── __tests__/       # テストファイル
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # リクエストハンドラ
│   │   ├── services/        # ビジネスロジック
│   │   ├── repositories/    # データアクセス層
│   │   ├── models/          # データモデル
│   │   ├── middleware/      # ミドルウェア
│   │   ├── utils/           # ユーティリティ関数
│   │   ├── types/           # TypeScript型定義
│   │   └── __tests__/       # テストファイル
│   ├── package.json
│   └── tsconfig.json
├── shared/                   # 共通型定義・ユーティリティ
│   ├── types/               # API仕様に基づく共通型
│   └── utils/               # フロント・バック共通ユーティリティ
├── docs/                     # プロジェクトドキュメント
│   ├── api-specification.md # API仕様書
│   ├── database-schema.md   # データベース設計
│   └── deployment.md        # デプロイメント手順
├── scripts/                  # 開発・運用スクリプト
├── compose.yaml             # Docker開発環境
├── package.json             # ワークスペース設定
└── README.md
```

### 2. バックエンド API

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
├── docs/
│   ├── api-specification.md
│   └── database-schema.md
├── scripts/
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

### 3. フロントエンド SPA

```
my-frontend-app/
├── public/
├── src/
│   ├── components/         # UIコンポーネント
│   │   ├── ui/            # 基本UIコンポーネント
│   │   ├── forms/         # フォームコンポーネント
│   │   └── layout/        # レイアウトコンポーネント
│   ├── pages/             # ページコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── services/          # API通信
│   ├── stores/            # 状態管理
│   ├── utils/             # ユーティリティ
│   ├── types/             # TypeScript型定義
│   ├── styles/            # スタイルファイル
│   └── __tests__/         # テストファイル
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

### 4. Node.js CLI ツール

```
my-cli-tool/
├── src/
│   ├── commands/          # CLIコマンド実装
│   ├── services/          # 業務ロジック
│   ├── utils/             # ユーティリティ
│   ├── types/             # TypeScript型定義
│   └── __tests__/         # テストファイル
├── bin/                   # 実行ファイル
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

## 各ディレクトリの役割

### フロントエンド構造

#### `components/`
- **ui/**: ボタン、入力フィールドなど基本的なUIコンポーネント
- **forms/**: フォーム関連のコンポーネント
- **layout/**: ヘッダー、サイドバーなどレイアウトコンポーネント

#### `pages/`
- ルーティングに対応するページレベルのコンポーネント
- ページ固有のロジックと状態管理

#### `hooks/`
- React カスタムフック
- 再利用可能な状態ロジック

#### `services/`
- API通信ロジック
- 外部サービスとの連携

#### `stores/`
- 状態管理（Redux、Zustand、Jotai など）
- グローバル状態の定義

### バックエンド構造

#### `controllers/`
- HTTP リクエストの処理
- リクエスト・レスポンスの変換
- バリデーション結果の処理

#### `services/`
- ビジネスロジックの実装
- 複数のリポジトリ・外部サービスの調整
- トランザクション管理

#### `repositories/`
- データアクセス層
- データベース操作の抽象化
- クエリの実装

#### `models/`
- データモデルの定義
- データベーススキーマの表現
- バリデーションルール

#### `middleware/`
- 認証・認可
- リクエストログ
- エラーハンドリング

### 共通構造

#### `types/`
- TypeScript 型定義
- API インターフェース
- ドメインモデル

#### `utils/`
- 汎用的なユーティリティ関数
- 定数定義
- ヘルパー関数

#### `__tests__/`
- 単体テスト
- 統合テスト
- E2E テスト

## 設定ファイル

### 必須設定

#### `package.json`
```json
{
  "name": "project-name",
  "scripts": {
    "dev": "開発サーバー起動",
    "build": "本番ビルド",
    "test": "テスト実行",
    "lint": "リンターチェック",
    "typecheck": "型チェック"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

### 推奨設定

#### `.gitignore`
```
node_modules/
dist/
build/
.env
.env.local
coverage/
*.log
.DS_Store
```

#### `README.md` テンプレート
```markdown
# [プロジェクト名]

## 概要
[プロジェクトの概要]

## 技術スタック
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL

## セットアップ
npm install
npm run dev

## テスト
npm test

## デプロイ
[デプロイ手順]
```

## 選択指針

### フルスタック構造を選ぶべき場合
- フロントエンドとバックエンドを同時開発
- 型定義を共有したい
- 小〜中規模のアプリケーション

### 分離構造を選ぶべき場合
- 独立したデプロイサイクル
- 異なるチームでの開発
- 大規模なアプリケーション

### CLI ツール構造を選ぶべき場合
- コマンドラインツールの開発
- 自動化スクリプト
- 開発者向けユーティリティ

## カスタマイズ指針

### プロジェクト特性に応じた調整
- **UI ライブラリ使用**: `components/ui/` を調整
- **状態管理ライブラリ**: `stores/` 構造を調整
- **データベース ORM**: `repositories/`, `models/` を調整
- **認証システム**: `middleware/auth/` を追加

### チーム開発での調整
- **機能別ディレクトリ**: `features/` を追加
- **共通コンポーネント**: `shared/` を拡張
- **スタイルガイド**: `styles/` を詳細化

## 関連ドキュメント

- [開発ワークフロー](../../standards/development-workflow.md)
- [アーキテクチャガイド](../../standards/architecture.md)
- [フルスタック統合ガイド](../../setup/fullstack-integration.md)