# 統一設定テンプレート

このディレクトリには、Claude Codeが使用する統一された設定ファイルテンプレートが含まれています。すべてのプロジェクトタイプ（フロントエンド、バックエンド、フルスタック）で共通して使用できる最適化された設定です。

## 📁 テンプレート一覧

### 🔧 設定ファイル (`config/`)

#### [`eslint.config.js`](./config/eslint.config.js) - ESLint設定
**目的**: TypeScript + React + Node.js対応の統一ESLint設定

**主要機能**:
- TypeScript完全対応
- React Hooks ルール（フロントエンド）
- 未使用コード検出
- Import順序自動整理
- ファイルタイプ別ルール設定

**対応環境**:
- ✅ フロントエンド（React）
- ✅ バックエンド（Node.js）
- ✅ テストファイル

#### [`prettier.config.js`](./config/prettier.config.js) - Prettier設定
**目的**: 一貫したコードフォーマット

**特徴**:
- Tailwind CSS対応（プラグイン有効化可能）
- ファイル別設定（JSON、Markdown等）
- プロジェクト横断で統一されたスタイル

#### [`tsconfig.json`](./config/tsconfig.json) - TypeScript設定
**目的**: 厳格な型チェックと最適化

**主要設定**:
- Strict mode有効
- パス解決設定（`@/*`, `~/*`）
- React JSX対応
- Vitest/Testing Library型定義

#### [`package.json`](./config/package.json) - 標準スクリプト
**目的**: プロジェクト横断で統一されたnpmスクリプト

**標準スクリプト**:
```json
{
  "typecheck": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
  "format": "prettier --write .",
  "test": "vitest",
  "quality": "npm run typecheck && npm run lint && npm run test:run && npm run build"
}
```

## 🚀 Claude Code向け使用方法

### 新規プロジェクト初期化時

Claude Codeは以下の手順で設定ファイルをコピーしてください：

```bash
# 1. 設定ファイルをプロジェクトルートにコピー
cp @docs/guide/shared/templates/config/eslint.config.js ./
cp @docs/guide/shared/templates/config/prettier.config.js ./
cp @docs/guide/shared/templates/config/tsconfig.json ./

# 2. package.jsonの内容をマージ（既存がある場合）
# package.jsonテンプレートから必要なスクリプトと依存関係を追加

# 3. 依存関係のインストール
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D eslint-plugin-unused-imports eslint-plugin-import
npm install -D typescript vitest

# 4. 設定の動作確認
npm run typecheck
npm run lint
npm run format:check
```

### プロジェクトタイプ別カスタマイズ

#### フロントエンド（React）プロジェクト
```bash
# 追加の依存関係
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh
npm install -D prettier-plugin-tailwindcss

# tsconfig.jsonで有効化
# "jsx": "react-jsx"（既に設定済み）
```

#### バックエンド（Node.js）プロジェクト
```bash
# Node.js固有の設定は既にeslint.config.jsに含まれています
# 追加設定は不要

# Express用の追加パッケージ（必要に応じて）
npm install -D @types/express @types/cors
```

### 既存プロジェクトへの適用

```bash
# 1. 現在の設定をバックアップ
mv eslint.config.js eslint.config.js.bak 2>/dev/null || true
mv prettier.config.js prettier.config.js.bak 2>/dev/null || true

# 2. 統一設定をコピー
cp @docs/guide/shared/templates/config/eslint.config.js ./
cp @docs/guide/shared/templates/config/prettier.config.js ./

# 3. 段階的な修正
npm run lint:fix
npm run format

# 4. 残存エラーの手動修正
npm run lint
npm run typecheck
```

## 🔧 設定ファイルのカスタマイズ

### ESLint ルールの調整

プロジェクト固有のルールを追加する場合：

```javascript
// eslint.config.js の rules セクションに追加
rules: {
  // 既存のルール...
  
  // プロジェクト固有ルール
  'custom-rule': 'error',
}
```

### Prettier オプションの調整

```javascript
// prettier.config.js
export default {
  // 基本設定...
  
  // プロジェクト固有の調整
  printWidth: 120, // デフォルト100から変更
}
```

### TypeScript コンパイラオプション

```json
{
  "compilerOptions": {
    // 基本設定...
    
    // プロジェクト固有パス
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

## 📋 品質チェックリスト

設定適用後は以下を確認してください：

### 必須チェック
- [ ] `npm run typecheck` がエラー0個
- [ ] `npm run lint` がエラー0個
- [ ] `npm run format:check` が警告0個
- [ ] `npm run test` が全てパス

### 推奨チェック
- [ ] IDE でリアルタイム型チェックが動作
- [ ] 保存時に自動フォーマットが動作
- [ ] 未使用importが自動削除される
- [ ] import順序が自動整理される

## 🔗 関連ガイド

- [開発ワークフローガイド](../development-workflow.md): 設定ファイルを使った開発フロー
- [フロントエンド設定ガイド](../../frontend/react-router-v7-setup.md): React特化設定
- [バックエンド設定ガイド](../../backend/node-typescript-setup.md): Node.js特化設定

---

**重要**: これらの設定テンプレートは、Claude Codeが迷わず実行できるよう最適化されています。カスタマイズする場合も、基本構造は維持してください。