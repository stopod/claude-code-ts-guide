# 継続的改善・管理ガイド

## 概要

プロジェクト継続・品質向上・長期運用のための統合ガイドです。アーキテクチャ設計思想、コード品質改善、設計判断管理、プロジェクト運用の全工程を網羅します。

## 関数型TypeScriptアーキテクチャ設計

### 基本設計思想

1. **完全関数型アプローチ**: 純粋関数、不変性、関数合成による設計
2. **型安全性**: TypeScriptの型システムを最大限活用
3. **Result型**: 例外に依存しない型安全なエラーハンドリング
4. **関数型Repository**: データアクセス層の関数による抽象化
5. **関数型Dependency Injection**: Higher-Order Functionsによる依存関係の管理

### レイヤー構成

```
app/
├── features/[feature-name]/
│   ├── components/          # Presentation Layer (React Components)
│   ├── services/            # 完全関数型Service層
│   │   └── [feature]-service.ts              # 関数型Service実装
│   ├── repositories/        # 関数型Repository層
│   │   ├── [feature]-repository.ts           # Repository Interface
│   │   └── db-[feature]-repository.ts        # DB実装（汎用）
│   ├── lib/                 # 純粋関数のみ
│   │   ├── business-logic.ts    # ビジネスロジック関数
│   │   ├── schemas.ts           # バリデーションスキーマ
│   │   └── repository-functions.ts # 関数型DI
│   ├── hooks/               # Custom React Hooks
│   └── types.ts             # Domain Types
└── shared/
    ├── types/
    │   ├── result.ts        # Result<T, E> Type Definition
    │   ├── errors.ts        # Domain Error Types
    │   └── database.ts      # Database Schema Types
    ├── utils/
    │   └── result-helpers.ts # Result Operation Helpers
    └── hooks/
        └── use-result-operation.ts # Result-aware React Hooks
```

### Result型によるエラーハンドリング

#### Result型の定義

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// ヘルパー関数
const ok = <T>(data: T): Result<T> => ({ success: true, data });
const err = <E>(error: E): Result<never, E> => ({ success: false, error });

// Result操作関数
const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> => {
  return result.success ? ok(fn(result.data)) : result;
};

const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  return result.success ? fn(result.data) : result;
};
```

#### 関数型Repository実装

```typescript
// Repository Interface（関数型）
type UserRepository = {
  findById: (id: string) => Promise<Result<User | null, DatabaseError>>;
  create: (user: CreateUserData) => Promise<Result<User, DatabaseError>>;
  update: (id: string, data: UpdateUserData) => Promise<Result<User, DatabaseError>>;
};

// Database Connection Type（汎用）
type DatabaseConnection = {
  query: (sql: string, params: unknown[]) => Promise<Result<unknown[], DatabaseError>>;
  transaction: <T>(operations: DatabaseOperation[]) => Promise<Result<T, DatabaseError>>;
};

// Database Repository Implementation（汎用）
const createUserRepository = (db: DatabaseConnection): UserRepository => ({
  async findById(id: string): Promise<Result<User | null, DatabaseError>> {
    try {
      const queryResult = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );

      if (!queryResult.success) {
        return err(queryResult.error);
      }

      const user = queryResult.data[0] as User | undefined;
      return ok(user || null);
    } catch (error) {
      return err(new DatabaseError('Unexpected database error'));
    }
  },

  async create(userData: CreateUserData): Promise<Result<User, DatabaseError>> {
    try {
      const queryResult = await db.query(
        'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
        [userData.name, userData.email, userData.age]
      );

      if (!queryResult.success) {
        return err(queryResult.error);
      }

      const user = queryResult.data[0] as User;
      return ok(user);
    } catch (error) {
      return err(new DatabaseError('Failed to create user'));
    }
  },

  async update(id: string, data: UpdateUserData): Promise<Result<User, DatabaseError>> {
    const updateFields = Object.entries(data)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const queryResult = await db.query(
      `UPDATE users SET ${updateFields} WHERE id = $1 RETURNING *`,
      [id, ...Object.values(data)]
    );

    if (!queryResult.success) {
      return err(queryResult.error);
    }

    const user = queryResult.data[0] as User;
    return ok(user);
  }
});
```

### 完全関数型Service層の実装

```typescript
// 純粋なビジネスロジック関数
const validateUserAge = (age: number): Result<number, ValidationError> => {
  if (age < 0 || age > 150) {
    return err(new ValidationError('Invalid age range'));
  }
  return ok(age);
};

const validateUserEmail = (email: string): Result<string, ValidationError> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return err(new ValidationError('Invalid email format'));
  }
  return ok(email);
};

const calculateMembershipTier = (totalPurchase: number): MembershipTier => {
  if (totalPurchase > 100000) return 'premium';
  if (totalPurchase > 50000) return 'gold';
  return 'standard';
};

// バリデーション関数の合成
const validateUserData = (userData: CreateUserData): Result<CreateUserData, ValidationError> => {
  const ageResult = validateUserAge(userData.age);
  if (!ageResult.success) return ageResult;

  const emailResult = validateUserEmail(userData.email);
  if (!emailResult.success) return emailResult;

  return ok(userData);
};

// 関数型Dependency Injection
type UserServiceDeps = {
  userRepo: UserRepository;
  logger: (message: string) => void;
};

// 完全関数型Service実装
const createUserService = (deps: UserServiceDeps) => {
  const { userRepo, logger } = deps;

  return {
    async createUser(userData: CreateUserData): Promise<Result<User, ServiceError>> {
      logger(`Creating user: ${userData.email}`);

      // 1. バリデーション
      const validationResult = validateUserData(userData);
      if (!validationResult.success) {
        return err(new ServiceError(validationResult.error.message));
      }

      // 2. ビジネスロジック適用
      const enrichedUserData = {
        ...userData,
        membershipTier: calculateMembershipTier(userData.totalPurchase || 0),
        createdAt: new Date()
      };

      // 3. Repository操作
      const createResult = await userRepo.create(enrichedUserData);
      if (!createResult.success) {
        logger(`Failed to create user: ${createResult.error.message}`);
        return err(new ServiceError('Failed to create user'));
      }

      logger(`User created successfully: ${createResult.data.id}`);
      return ok(createResult.data);
    },

    async getUserById(id: string): Promise<Result<User | null, ServiceError>> {
      logger(`Fetching user: ${id}`);

      const findResult = await userRepo.findById(id);
      if (!findResult.success) {
        logger(`Failed to fetch user: ${findResult.error.message}`);
        return err(new ServiceError('Failed to fetch user'));
      }

      return ok(findResult.data);
    },

    async updateUser(id: string, updateData: UpdateUserData): Promise<Result<User, ServiceError>> {
      logger(`Updating user: ${id}`);

      // 年齢が含まれている場合のバリデーション
      if (updateData.age !== undefined) {
        const ageValidation = validateUserAge(updateData.age);
        if (!ageValidation.success) {
          return err(new ServiceError(ageValidation.error.message));
        }
      }

      const updateResult = await userRepo.update(id, updateData);
      if (!updateResult.success) {
        logger(`Failed to update user: ${updateResult.error.message}`);
        return err(new ServiceError('Failed to update user'));
      }

      logger(`User updated successfully: ${id}`);
      return ok(updateResult.data);
    }
  };
};

// 関数合成によるサービス拡張
const withErrorLogging = <T extends Record<string, (...args: any[]) => Promise<Result<any, any>>>>(
  service: T,
  errorLogger: (error: string) => void
): T => {
  return Object.fromEntries(
    Object.entries(service).map(([key, fn]) => [
      key,
      async (...args: any[]) => {
        const result = await fn(...args);
        if (!result.success) {
          errorLogger(`${key} failed: ${result.error.message}`);
        }
        return result;
      }
    ])
  ) as T;
};

// 使用例
const createEnhancedUserService = (deps: UserServiceDeps & { errorLogger: (error: string) => void }) => {
  const baseService = createUserService(deps);
  return withErrorLogging(baseService, deps.errorLogger);
};
```

## コードクリーンアップ自動化戦略

### 段階的改善アプローチ

品質改善は**必ず**以下の順序で実行してください：

1. **Phase 1: 品質基盤構築** (Critical)
2. **Phase 2: UI/コンポーネント統一** (High)
3. **Phase 3: 未使用コード削除** (Medium)
4. **Phase 4: アーキテクチャ最適化** (Low)

### Phase 1: 品質基盤構築

#### 必須ツール設定確認

```bash
# 1. package.json内の必須スクリプト確認
cat package.json | grep -A 5 '"scripts"'

# 必須スクリプトの例：
# "typecheck": "tsc --noEmit"
# "lint": "eslint . --ext .ts,.tsx"
# "format": "prettier --write ."
# "test": "vitest"
# "build": "vite build"
```

#### TypeScriptエラー修正

```bash
# TypeScriptエラーの確認
npm run typecheck

# エラー数が多い場合、段階的に修正
npm run typecheck 2>&1 | head -20  # 最初の20エラーに絞って対応
```

#### 段階的修正戦略

1. **Critical Errors**: ビルドを阻害するエラー
2. **Type Safety**: 型安全性に関わるエラー
3. **Best Practice**: コード品質向上のエラー

### Phase 2: UI/コンポーネント統一

#### 重複コンポーネント特定

```bash
# 類似コンポーネント検索
find src -name "*.tsx" -exec basename {} \; | sort | uniq -d

# 重複する可能性のあるコンポーネント名パターン
# Button, Modal, Input, Card, Loading など
```

#### shadcn/ui 統一戦略

```bash
# shadcn/ui コンポーネントの段階的導入
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add modal

# 既存コンポーネントを段階的に置換
# 1つずつテストを確認しながら移行
```

### Phase 3: 未使用コード削除

#### 未使用ファイル・関数の検出

```bash
# 未使用ファイル検出（ts-prune使用）
npx ts-prune

# 未使用import検出（eslint使用）
npm run lint | grep "is defined but never used"

# 未使用CSS検出（purgecss使用）
npx purgecss --content 'src/**/*.{tsx,ts}' --css 'src/**/*.css'
```

#### 安全な削除手順

1. **バックアップ作成**: `git stash` または別ブランチ
2. **段階的削除**: 一度に大量削除せず、小単位で実行
3. **テスト実行**: 削除後必ずテスト実行
4. **動作確認**: 主要機能の手動確認

### Phase 4: アーキテクチャ最適化

#### パフォーマンス最適化

```typescript
// React.memoの適切な使用
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => 
    heavyComputation(data), [data]
  );
  
  return <div>{processedData}</div>;
});

// useCallbackの適切な使用
const ParentComponent = () => {
  const handleClick = useCallback((id: string) => {
    // 処理
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};
```

#### バンドルサイズ最適化

```bash
# バンドル分析
npm run build
npx vite-bundle-analyzer

# 動的インポートによるコード分割
const LazyComponent = lazy(() => import('./HeavyComponent'));

# 不要な依存関係の検出
npx depcheck
```

## 設計判断プロセスと記録管理

### 設計判断の基本原則

#### 判断基準の明確化

**技術的観点**:
- **パフォーマンス**: レスポンス時間、スループット、メモリ使用量
- **保守性**: コード可読性、テスタビリティ、モジュール性
- **拡張性**: 機能追加の容易さ、スケールアウト対応
- **セキュリティ**: 脆弱性対策、データ保護、アクセス制御

**事業的観点**:
- **開発効率**: 実装速度、学習コスト、開発者体験
- **運用コスト**: インフラ費用、保守費用、監視コスト
- **リスク**: 技術的負債、ベンダーロックイン、廃止リスク

### 設計判断記録（ADR）テンプレート

```markdown
# ADR-[番号]: [判断タイトル]

## ステータス
[決定済み/検討中/却下/廃止]

## コンテキスト
[背景と問題の説明]

## 決定内容
[採用した解決策]

## 結果
[この決定によって生じる影響]

## 検討した選択肢
- 選択肢A: [内容と評価]
- 選択肢B: [内容と評価]
- 選択肢C: [内容と評価]

## 決定理由
[なぜこの選択肢を選んだか]

## 影響
- ポジティブな影響
- ネガティブな影響
- リスクと軽減策

## 見直し条件
[どのような状況で再検討するか]

## 関連ADR
[関連する他の決定事項]
```

### Claude Code との設計相談方法

#### 効果的な相談の準備

```markdown
## 設計相談テンプレート

### 背景
- 現在の技術スタック: [詳細]
- プロジェクトの制約: [時間・リソース・技術的制約]
- パフォーマンス要件: [具体的な数値]

### 解決したい課題
[具体的な問題の説明]

### 検討している選択肢
1. 選択肢A: [概要・メリット・デメリット]
2. 選択肢B: [概要・メリット・デメリット]
3. 選択肢C: [概要・メリット・デメリット]

### 判断基準
- 優先度1: [最重要な基準]
- 優先度2: [次に重要な基準]
- 優先度3: [その他の基準]

### 期待する回答
[どのような観点でのアドバイスを求めるか]
```

## プロジェクトライフサイクル管理

### 保守・運用フェーズ

#### 日常運用の継続的改善

**監視・アラート対応**:
- システムの健全性確認
- パフォーマンスメトリクスの監視
- エラー率とレスポンス時間の追跡

**セキュリティ管理**:
- 依存関係の脆弱性チェック
- セキュリティアップデートの適用
- アクセスログの定期確認

#### 技術的負債の継続的解消

**定期的なリファクタリング**:
```bash
# 週次品質チェック
npm run typecheck
npm run lint
npm run test
npm run build

# 依存関係の更新チェック
npm audit
npm outdated

# コード品質メトリクス確認
npx tsx scripts/code-metrics.ts
```

**パフォーマンス最適化**:
- バンドルサイズの定期監視
- Core Web Vitals の継続的改善
- データベースクエリの最適化

#### 機能拡張の品質管理

**新機能開発時のチェックリスト**:
- [ ] アーキテクチャ設計原則に準拠
- [ ] Result型によるエラーハンドリング実装
- [ ] 適切なテストカバレッジ確保
- [ ] パフォーマンス影響の評価
- [ ] セキュリティ要件の確認

**コードレビューの品質基準**:
1. **機能性**: 要件通りに動作するか
2. **可読性**: 他の開発者が理解できるか
3. **保守性**: 将来の変更に対応しやすいか
4. **パフォーマンス**: 性能要件を満たすか
5. **セキュリティ**: 脆弱性がないか

### 長期的な品質向上戦略

#### 定期レビューの実施

**月次品質レビュー**:
- コード品質メトリクス分析
- テストカバレッジ確認
- パフォーマンス指標評価
- セキュリティ監査結果確認

**四半期アーキテクチャレビュー**:
- 技術スタックの妥当性確認
- アーキテクチャ決定の振り返り
- 技術的負債の優先順位付け
- 次期改善計画の策定

#### チーム知識の体系化

**ナレッジベース構築**:
- 設計判断記録（ADR）の蓄積
- トラブルシューティングガイド
- ベストプラクティス集
- 新人オンボーディング資料

**継続的学習**:
- 技術動向の調査・評価
- チーム内勉強会の実施
- 外部カンファレンス参加
- 知見の社内共有

## 関連ドキュメント

- [Claude Code 実行ガイド](./claude-execution.md): 開発時の必須ルール・手順
- [プロジェクト初期設定ガイド](./project-initialization.md): 新プロジェクト開始時の設定

---

**重要**: 継続的改善は一度で完了するものではありません。定期的にこのガイドを参照し、プロジェクトの状況に応じて適切な改善活動を継続してください。