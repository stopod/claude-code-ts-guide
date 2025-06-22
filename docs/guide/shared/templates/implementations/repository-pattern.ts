/**
 * Repository Pattern完全実装
 * 
 * データアクセス層の抽象化とテスト可能性を提供
 * Claude Codeが迷わず実装できるよう、全ての必要な機能とパターンを含みます。
 */

import { Result, success, failure, AppError, notFoundError } from './result';

// =============================================================================
// 基本型定義
// =============================================================================

/**
 * エンティティベース型（全てのエンティティが継承）
 */
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * 作成用データ型（IDとタイムスタンプを除く）
 */
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 更新用データ型（IDとタイムスタンプを除く、全てオプショナル）
 */
export type UpdateData<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * クエリオプション
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}

/**
 * ページネーション結果
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// =============================================================================
// Repository インターフェース
// =============================================================================

/**
 * 基本Repository インターフェース
 * @template T エンティティ型
 */
export interface Repository<T extends BaseEntity> {
  /**
   * IDでエンティティを取得
   */
  findById(id: string): Promise<Result<T | null, AppError>>;

  /**
   * 全エンティティを取得
   */
  findAll(options?: QueryOptions): Promise<Result<PaginatedResult<T>, AppError>>;

  /**
   * 条件でエンティティを検索
   */
  findBy(criteria: Partial<T>, options?: QueryOptions): Promise<Result<PaginatedResult<T>, AppError>>;

  /**
   * 条件で単一エンティティを取得
   */
  findOneBy(criteria: Partial<T>): Promise<Result<T | null, AppError>>;

  /**
   * エンティティを作成
   */
  create(data: CreateData<T>): Promise<Result<T, AppError>>;

  /**
   * エンティティを更新
   */
  update(id: string, data: UpdateData<T>): Promise<Result<T, AppError>>;

  /**
   * エンティティを削除
   */
  delete(id: string): Promise<Result<void, AppError>>;

  /**
   * エンティティの存在確認
   */
  exists(id: string): Promise<Result<boolean, AppError>>;

  /**
   * 件数を取得
   */
  count(criteria?: Partial<T>): Promise<Result<number, AppError>>;
}

// =============================================================================
// 実装例: User エンティティ
// =============================================================================

/**
 * ユーザーエンティティ例
 */
export interface User extends BaseEntity {
  readonly name: string;
  readonly email: string;
  readonly role: 'admin' | 'user';
  readonly isActive: boolean;
}

/**
 * User専用Repository インターフェース
 */
export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<Result<User | null, AppError>>;
  findActiveUsers(): Promise<Result<User[], AppError>>;
  findByRole(role: User['role']): Promise<Result<User[], AppError>>;
}

// =============================================================================
// In-Memory実装（テスト・開発用）
// =============================================================================

/**
 * インメモリRepository実装（テスト・開発用）
 */
export class InMemoryRepository<T extends BaseEntity> implements Repository<T> {
  protected data: Map<string, T> = new Map();
  private nextId = 1;

  /**
   * IDを生成
   */
  protected generateId(): string {
    return `id_${this.nextId++}`;
  }

  /**
   * 現在時刻を取得
   */
  protected now(): Date {
    return new Date();
  }

  async findById(id: string): Promise<Result<T | null, AppError>> {
    const entity = this.data.get(id) || null;
    return success(entity);
  }

  async findAll(options: QueryOptions = {}): Promise<Result<PaginatedResult<T>, AppError>> {
    const entities = Array.from(this.data.values());
    
    // フィルタリング
    let filtered = entities;
    if (options.filters) {
      filtered = entities.filter(entity =>
        Object.entries(options.filters!).every(([key, value]) =>
          (entity as any)[key] === value
        )
      );
    }

    // ソート
    if (options.sortBy) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[options.sortBy!];
        const bVal = (b as any)[options.sortBy!];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // ページネーション
    const total = filtered.length;
    const limit = options.limit || total;
    const offset = options.offset || 0;
    const items = filtered.slice(offset, offset + limit);

    const result: PaginatedResult<T> = {
      items,
      total,
      limit,
      offset,
      hasNext: offset + limit < total,
      hasPrev: offset > 0,
    };

    return success(result);
  }

  async findBy(criteria: Partial<T>, options?: QueryOptions): Promise<Result<PaginatedResult<T>, AppError>> {
    return this.findAll({
      ...options,
      filters: { ...options?.filters, ...criteria },
    });
  }

  async findOneBy(criteria: Partial<T>): Promise<Result<T | null, AppError>> {
    const result = await this.findBy(criteria, { limit: 1 });
    if (result.success) {
      const entity = result.data.items[0] || null;
      return success(entity);
    }
    return result;
  }

  async create(data: CreateData<T>): Promise<Result<T, AppError>> {
    const id = this.generateId();
    const now = this.now();
    
    const entity = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    } as T;

    this.data.set(id, entity);
    return success(entity);
  }

  async update(id: string, data: UpdateData<T>): Promise<Result<T, AppError>> {
    const existing = this.data.get(id);
    if (!existing) {
      return failure(notFoundError('Entity', id));
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: this.now(),
    } as T;

    this.data.set(id, updated);
    return success(updated);
  }

  async delete(id: string): Promise<Result<void, AppError>> {
    if (!this.data.has(id)) {
      return failure(notFoundError('Entity', id));
    }

    this.data.delete(id);
    return success(undefined);
  }

  async exists(id: string): Promise<Result<boolean, AppError>> {
    return success(this.data.has(id));
  }

  async count(criteria?: Partial<T>): Promise<Result<number, AppError>> {
    if (!criteria) {
      return success(this.data.size);
    }

    const result = await this.findBy(criteria);
    if (result.success) {
      return success(result.data.total);
    }
    return result;
  }

  // テスト用メソッド
  clear(): void {
    this.data.clear();
    this.nextId = 1;
  }

  seed(entities: T[]): void {
    entities.forEach(entity => {
      this.data.set(entity.id, entity);
    });
  }
}

// =============================================================================
// User専用In-Memory実装
// =============================================================================

export class InMemoryUserRepository extends InMemoryRepository<User> implements UserRepository {
  async findByEmail(email: string): Promise<Result<User | null, AppError>> {
    return this.findOneBy({ email } as Partial<User>);
  }

  async findActiveUsers(): Promise<Result<User[], AppError>> {
    const result = await this.findBy({ isActive: true } as Partial<User>);
    if (result.success) {
      return success(result.data.items);
    }
    return result;
  }

  async findByRole(role: User['role']): Promise<Result<User[], AppError>> {
    const result = await this.findBy({ role } as Partial<User>);
    if (result.success) {
      return success(result.data.items);
    }
    return result;
  }
}

// =============================================================================
// Repository Factory
// =============================================================================

/**
 * Repository設定オプション
 */
export interface RepositoryConfig {
  type: 'memory' | 'prisma' | 'custom';
  connectionString?: string;
  options?: Record<string, unknown>;
}

/**
 * Repository Factory
 */
export class RepositoryFactory {
  private static config: RepositoryConfig = { type: 'memory' };
  private static instances: Map<string, unknown> = new Map();

  /**
   * Factory設定
   */
  static configure(config: RepositoryConfig): void {
    this.config = config;
    this.instances.clear(); // 設定変更時はインスタンスをクリア
  }

  /**
   * User Repository作成
   */
  static createUserRepository(): UserRepository {
    const key = 'user';
    
    if (!this.instances.has(key)) {
      let repository: UserRepository;
      
      switch (this.config.type) {
        case 'memory':
          repository = new InMemoryUserRepository();
          break;
        case 'prisma':
          // Prisma実装をここで作成（実装例は別ファイル）
          throw new Error('Prisma implementation not available in this example');
        case 'custom':
          throw new Error('Custom repository must be registered explicitly');
        default:
          throw new Error(`Unknown repository type: ${this.config.type}`);
      }
      
      this.instances.set(key, repository);
    }
    
    return this.instances.get(key) as UserRepository;
  }

  /**
   * 汎用Repository作成
   */
  static createRepository<T extends BaseEntity>(entityName: string): Repository<T> {
    if (!this.instances.has(entityName)) {
      let repository: Repository<T>;
      
      switch (this.config.type) {
        case 'memory':
          repository = new InMemoryRepository<T>();
          break;
        default:
          throw new Error(`Repository for ${entityName} not implemented for type: ${this.config.type}`);
      }
      
      this.instances.set(entityName, repository);
    }
    
    return this.instances.get(entityName) as Repository<T>;
  }

  /**
   * カスタムRepositoryを登録
   */
  static register<T>(key: string, repository: T): void {
    this.instances.set(key, repository);
  }

  /**
   * 全インスタンスをクリア
   */
  static clear(): void {
    this.instances.clear();
  }
}

// =============================================================================
// テスト用ヘルパー
// =============================================================================

/**
 * テスト用Repository セットアップ
 */
export const setupTestRepositories = () => {
  RepositoryFactory.configure({ type: 'memory' });
  
  const userRepo = RepositoryFactory.createUserRepository() as InMemoryUserRepository;
  userRepo.clear();
  
  return {
    userRepository: userRepo,
    cleanup: () => {
      RepositoryFactory.clear();
    },
  };
};

/**
 * テスト用ダミーデータ作成
 */
export const createTestUser = (overrides: Partial<CreateData<User>> = {}): CreateData<User> => ({
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  isActive: true,
  ...overrides,
});

// =============================================================================
// 型定義エクスポート
// =============================================================================

export type {
  BaseEntity,
  CreateData,
  UpdateData,
  QueryOptions,
  PaginatedResult,
  Repository,
  User,
  UserRepository,
  RepositoryConfig,
};