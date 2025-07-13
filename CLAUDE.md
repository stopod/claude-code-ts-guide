## 基本ルール

- 私への回答は日本語を使用してください

## 必須開発ワークフロー

### ブランチ作成の強制

**すべての作業開始前に必ずブランチを作成してください**：

```bash
# 1. mainブランチから最新を取得
git checkout main
git pull origin main

# 2. 機能ブランチを作成（feature/機能名の形式で必須）
git checkout -b feature/具体的な機能名

# 3. ブランチ作成の確認
git branch --show-current
```

**重要**: 機能名は具体的で分かりやすい名前にしてください。

- ✅ `feature/user-authentication`
- ✅ `feature/fullstack-guide-structure-fix`
- ❌ `feature/fix` (抽象的すぎる)

### git push 絶対禁止

**Claude Code は以下のコマンドを絶対に実行してはいけません**：

```bash
# ❌ 絶対に実行禁止
git push
git push origin [branch-name]
git push --force
```

**理由**: ローカル完結の開発サイクルを維持し、意図しない変更の公開を防止

### 品質チェック必須

**コミット前に以下を必ず実行してください**：

```bash
# 1. TypeScript型チェック
npm run typecheck

# 2. テスト実行
npm test

# 3. リント実行
npm run lint

# 4. ビルド確認
npm run build
```

すべてがパスした場合のみコミットを実行してください。

## プロジェクト構造方針

### 現実的なアーキテクチャ重視

**過度に複雑な共有パッケージ構造を避けてください**：

- ❌ `packages/shared` のような複雑な共有パッケージ
- ❌ `@app/shared` のようなワークスペース依存
- ✅ `frontend/backend` の独立構造
- ✅ API 仕様書による型定義同期

### 独立デプロイ可能構造

**frontend/backend が独立してデプロイできる構造を維持**：

```
my-fullstack-app/
├── frontend/          # React Router v7 アプリ
│   ├── package.json   # 独立したスクリプト設定
│   └── src/types/     # フロントエンド用型定義
├── backend/           # Node.js + Express アプリ
│   ├── package.json   # 独立したスクリプト設定
│   └── src/types/     # バックエンド用型定義
├── package.json       # ワークスペース統合スクリプトのみ
└── docs/api-spec.md   # 型定義同期用API仕様書
```

### npm workspaces 活用

**cd コマンドではなく-w フラグを使用**：

```bash
# ❌ 避けるべきパターン
"dev:backend": "cd backend && npm run dev"

# ✅ 推奨パターン
"dev:backend": "npm run dev -w backend"
```

### Docker 設定

**compose.yaml（推奨）を使用**：

```bash
# ❌ 古い形式
docker-compose.yml

# ✅ 推奨形式
compose.yaml
```

## TDD 実践指針

**詳細は以下のドキュメントを必ず読んで実践してください**：

- **[実践的 TDD 実装ガイド](./docs/standards/practical-tdd-implementation.md)**: t-wada 流 TDD の完全な実践手順
- **[開発ワークフローガイド](./docs/standards/development-workflow.md)**: テスト駆動開発を含む詳細な開発手順

## コード品質基準

**詳細は以下のドキュメントを必ず読んで実践してください**：

- **[関数型 TypeScript アーキテクチャガイド](./docs/standards/architecture.md)**: Result 型、関数型パターン、アーキテクチャ設計
- **[開発ワークフローガイド](./docs/standards/development-workflow.md)**: 品質チェック手順と目標指標

## コミット規約

### コミットタイミング（必須）

**以下のタイミングで必ずコミットしてください**：

1. テストコード作成後
2. 実装完了後（テストがパス）
3. リファクタリング完了後
4. 機能の一部が完成した時点

### コミットメッセージ形式

**以下の形式で詳細なコミットメッセージを作成**：

```bash
git commit -m "$(cat <<'EOF'
[type]: [日本語での変更内容]

[詳細説明（英語）]

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### type 一覧

- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメント更新
- `style`: コードスタイル修正
- `chore`: その他の変更

### コミット例

```
feat: ユーザー認証機能を追加

Add user authentication with login/logout functionality
- Implement login form component with validation
- Add authentication service using Result type pattern
- Create auth context for global state management
- Add protected route wrapper component

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 関連ドキュメント

このファイルと合わせて以下の統合ガイドを参照してください：

### [Claude Code 実行ガイド](./docs/claude-execution.md)
**作業時に必ず参照**
- ブランチ作成・コミット規約
- TDD実践必須手順
- 品質チェック項目
- 効果的な協働方法

### [プロジェクト初期設定ガイド](./docs/project-initialization.md)
**新プロジェクト開始時に使用**
- 企画・要件整理手順
- 技術環境セットアップ
- プロジェクト構造テンプレート
- 初期実装の方針

### [継続的改善ガイド](./docs/continuous-improvement.md)
**プロジェクト継続・品質向上に使用**
- 関数型TypeScriptアーキテクチャ設計
- コードクリーンアップ自動化
- 設計判断プロセスと記録管理
- 長期運用・保守戦略

---

**重要**: この指示は絶対に守ってください。品質の高いコードベースを維持するために、すべての手順を確実に実行することが必要です。
