# Claude Code 実行必須ガイド

## 概要

Claude Code が作業時に必ず守るべき実行ルール・手順を定義します。このガイドは実際の開発作業中に常に参照される実行マニュアルです。

## 基本実行ルール

### 日本語での回答必須
- 私への回答は日本語を使用してください

### git push 絶対禁止
**Claude Code は以下のコマンドを絶対に実行してはいけません**：

```bash
# 絶対に実行禁止
git push
git push origin [branch-name]
git push --force
```

**理由**: ローカル完結の開発サイクルを維持し、意図しない変更の公開を防止

## 必須開発ワークフロー

### 1. 作業開始前の必須手順

**すべての作業開始前に必ずブランチを作成してください**：

```bash
# 1. 現在のブランチを確認
git branch --show-current

# 2. mainブランチから最新を取得
git checkout main
git pull origin main

# 3. 機能ブランチを作成（feature/機能名の形式で必須）
git checkout -b feature/具体的な機能名

# 4. ブランチ作成の確認
git branch --show-current
```

**重要**: 機能名は具体的で分かりやすい名前にしてください。

- ✅ `feature/user-authentication`
- ✅ `feature/bucket-item-search`
- ❌ `feature/fix` (抽象的すぎる)

### 2. 開発前の環境確認

```bash
# 依存関係のインストール確認
npm install

# TypeScript型チェック
npm run typecheck

# テスト実行（すべてパスすることを確認）
npm test

# 開発サーバー起動テスト（必要に応じて）
npm run dev
```

## テスト駆動開発 (TDD) 必須実践

### t-wada流Red-Green-Refactorサイクル

**Claude Code は以下の順序で必ず実装してください**：

1. **🔴 Red**: 失敗するテストを書く
2. **🟢 Green**: 最小限のコードでテストを通す
3. **🔄 Refactor**: テストを保ちながらコードを改善

### t-wada流3段階実装アプローチ

#### 段階1: 仮実装 (Fake Implementation)
- **目的**: まずテストを通すことだけに集中
- **手法**: ハードコーディングで値を返す
- **例**: `return "山田太郎"` のような固定値

#### 段階2: 三角測量 (Triangulation)
- **目的**: 複数のテストケースで一般化を促す
- **手法**: 異なる入力値の新しいテストを追加
- **例**: `"田中花子"` を返すテストを追加して実装を一般化

#### 段階3: 明白な実装 (Obvious Implementation)
- **目的**: 最終的な正しい実装に到達
- **手法**: ロジックを正しく実装
- **例**: 実際のビジネスロジックを実装

### TODOリスト駆動開発の強制

**Claude Code は開発開始前にTODOリストを作成してください**：

```typescript
/**
 * [機能名] TODOリスト
 * 
 * ✅ [完了した項目]
 * ⏳ [現在作業中の項目]
 * 📝 [未実装の項目]
 * 📝 [未実装の項目]
 */
```

### テストファースト開発の流れ

1. **要件をテストコードで表現**
   - 期待される動作をテストで記述
   - エッジケースも含めて網羅的に

2. **Red: テストを実行して失敗を確認**
   - 適切に失敗することを確認
   - エラーメッセージが期待通りかチェック

3. **Green: 最小限のコードでテストを通す**
   - 仮実装から開始
   - テストが通る最小限の実装

4. **Refactor: コードを改善**
   - 重複排除
   - 可読性向上
   - パフォーマンス改善

## 品質チェック必須手順

### コミット前の必須チェック

**すべてがパスした場合のみコミットを実行してください**：

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

Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

#### type 一覧
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメント更新
- `style`: コードスタイル修正
- `chore`: その他の変更

## 効果的な協働のためのコミュニケーション

### 要求の明確化
- **具体的な目標設定**: 何を実装したいかを明確に
- **制約条件の提示**: 技術的制約、時間的制約、品質要件
- **成功条件の定義**: 完了の判断基準を明確に

### 段階的な開発アプローチ
- 機能を小さな単位に分割
- 1つずつ実装・検証・改善のサイクル
- 継続的なフィードバック

### 効果的なフィードバック方法

#### 良い要求例
```
【目標】
ユーザー認証機能を実装したい

【具体的な要件】
- メールアドレスとパスワードでのログイン
- JWT トークンによるセッション管理
- パスワードリセット機能

【技術的制約】
- React + TypeScript で実装
- バックエンドは Node.js + Express
- データベースは PostgreSQL

【成功条件】
- ログイン・ログアウトが正常に動作
- 未認証時はログインページにリダイレクト
- セキュリティ要件を満たす
```

#### 避けるべき要求例
- 「ログイン機能を作って」（曖昧）
- 「なんとなく認証できればいい」（制約条件不明）
- 「動けばいい」（成功条件未定義）

## 実装時の必須確認項目

### セキュリティ
- 認証・認可の適切な実装
- XSS、CSRF対策の実装
- 機密情報の適切な管理

### パフォーマンス
- 不要な再レンダリングの防止
- データベースクエリの最適化
- メモリリークの防止

### 保守性
- 適切な関数・コンポーネント分割
- 明確な命名規則の遵守
- 十分なテストカバレッジ

### エラーハンドリング
- 適切なエラーメッセージの表示
- エラー境界の実装
- ログ出力の適切な実装

## 関連ドキュメント

- [プロジェクト初期設定ガイド](./project-initialization.md): 新プロジェクト開始時の設定
- [継続的改善ガイド](./continuous-improvement.md): 長期的な品質向上とアーキテクチャ設計

---

**重要**: このガイドの内容は絶対に守ってください。品質の高いコードベースを維持するために、すべての手順を確実に実行することが必要です。