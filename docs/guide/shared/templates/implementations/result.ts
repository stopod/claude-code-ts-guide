/**
 * Result型の完全実装
 * 
 * 関数型プログラミングアプローチによる型安全なエラーハンドリング
 * Claude Codeが迷わず実装できるよう、全ての必要な機能を含みます。
 */

// =============================================================================
// 基本型定義
// =============================================================================

/**
 * Result<T, E> - 成功か失敗かを表現する型
 * @template T 成功時の値の型
 * @template E エラーの型（デフォルト: Error）
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * 成功を表現するインターフェース
 */
export interface Success<T> {
  readonly success: true;
  readonly data: T;
  readonly error?: never;
}

/**
 * 失敗を表現するインターフェース
 */
export interface Failure<E> {
  readonly success: false;
  readonly data?: never;
  readonly error: E;
}

// =============================================================================
// 型ガード関数
// =============================================================================

/**
 * Resultが成功かどうかを判定
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> =>
  result.success === true;

/**
 * Resultが失敗かどうかを判定
 */
export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> =>
  result.success === false;

// =============================================================================
// コンストラクタ関数
// =============================================================================

/**
 * 成功のResultを作成
 */
export const success = <T>(data: T): Success<T> => ({
  success: true,
  data,
});

/**
 * 失敗のResultを作成
 */
export const failure = <E>(error: E): Failure<E> => ({
  success: false,
  error,
});

// =============================================================================
// エラー型定義
// =============================================================================

/**
 * アプリケーション共通エラー型
 */
export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly cause?: Error;
}

/**
 * バリデーションエラー
 */
export interface ValidationError extends AppError {
  readonly code: 'VALIDATION_ERROR';
  readonly field: string;
  readonly value: unknown;
}

/**
 * 404エラー
 */
export interface NotFoundError extends AppError {
  readonly code: 'NOT_FOUND';
  readonly resource: string;
  readonly id: string | number;
}

/**
 * 認証エラー
 */
export interface AuthenticationError extends AppError {
  readonly code: 'AUTHENTICATION_ERROR';
}

/**
 * 認可エラー
 */
export interface AuthorizationError extends AppError {
  readonly code: 'AUTHORIZATION_ERROR';
  readonly permission: string;
}

// =============================================================================
// エラーコンストラクタ
// =============================================================================

/**
 * バリデーションエラーを作成
 */
export const validationError = (
  field: string,
  value: unknown,
  message: string,
  details?: Record<string, unknown>
): ValidationError => ({
  code: 'VALIDATION_ERROR',
  message,
  field,
  value,
  details,
});

/**
 * NotFoundエラーを作成
 */
export const notFoundError = (
  resource: string,
  id: string | number,
  details?: Record<string, unknown>
): NotFoundError => ({
  code: 'NOT_FOUND',
  message: `${resource} with id ${id} not found`,
  resource,
  id,
  details,
});

/**
 * 認証エラーを作成
 */
export const authenticationError = (
  message: string = 'Authentication failed',
  details?: Record<string, unknown>
): AuthenticationError => ({
  code: 'AUTHENTICATION_ERROR',
  message,
  details,
});

/**
 * 認可エラーを作成
 */
export const authorizationError = (
  permission: string,
  message?: string,
  details?: Record<string, unknown>
): AuthorizationError => ({
  code: 'AUTHORIZATION_ERROR',
  message: message || `Permission denied: ${permission}`,
  permission,
  details,
});

// =============================================================================
// Result操作関数
// =============================================================================

/**
 * Resultの値をマップ（成功時のみ実行）
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  if (isSuccess(result)) {
    return success(fn(result.data));
  }
  return result;
};

/**
 * Resultのエラーをマップ（失敗時のみ実行）
 */
export const mapError = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  if (isFailure(result)) {
    return failure(fn(result.error));
  }
  return result;
};

/**
 * Resultをフラットマップ（成功時のみ実行、Result返す関数用）
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  if (isSuccess(result)) {
    return fn(result.data);
  }
  return result;
};

/**
 * 複数のResultを並列処理（全て成功時のみ成功）
 */
export const all = <T extends readonly unknown[], E>(
  results: { [K in keyof T]: Result<T[K], E> }
): Result<T, E> => {
  const values: unknown[] = [];
  
  for (const result of results) {
    if (isFailure(result)) {
      return result;
    }
    values.push(result.data);
  }
  
  return success(values as T);
};

/**
 * デフォルト値を指定して値を取得
 */
export const getOrElse = <T, E>(
  result: Result<T, E>,
  defaultValue: T
): T => {
  if (isSuccess(result)) {
    return result.data;
  }
  return defaultValue;
};

/**
 * デフォルト値を遅延評価で取得
 */
export const getOrElseLazy = <T, E>(
  result: Result<T, E>,
  getDefaultValue: () => T
): T => {
  if (isSuccess(result)) {
    return result.data;
  }
  return getDefaultValue();
};

// =============================================================================
// Try系関数（例外安全な実行）
// =============================================================================

/**
 * 同期関数を例外安全に実行
 */
export const tryCatch = <T>(fn: () => T): Result<T, Error> => {
  try {
    return success(fn());
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * 非同期関数を例外安全に実行
 */
export const tryCatchAsync = async <T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> => {
  try {
    const result = await fn();
    return success(result);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * カスタムエラーハンドラーで例外安全に実行
 */
export const tryCatchWith = <T, E>(
  fn: () => T,
  errorHandler: (error: unknown) => E
): Result<T, E> => {
  try {
    return success(fn());
  } catch (error) {
    return failure(errorHandler(error));
  }
};

// =============================================================================
// フィルタ関数
// =============================================================================

/**
 * 条件を満たす場合のみ成功を維持
 */
export const filter = <T, E>(
  result: Result<T, E>,
  predicate: (value: T) => boolean,
  errorFactory: () => E
): Result<T, E> => {
  if (isSuccess(result) && predicate(result.data)) {
    return result;
  }
  if (isSuccess(result)) {
    return failure(errorFactory());
  }
  return result;
};

// =============================================================================
// JSON変換サポート
// =============================================================================

/**
 * ResultをJSON形式に変換
 */
export const toJSON = <T, E>(result: Result<T, E>) => {
  if (isSuccess(result)) {
    return {
      success: true,
      data: result.data,
    };
  }
  return {
    success: false,
    error: result.error,
  };
};

/**
 * JSON形式からResultに変換
 */
export const fromJSON = <T, E>(json: {
  success: boolean;
  data?: T;
  error?: E;
}): Result<T, E> => {
  if (json.success && json.data !== undefined) {
    return success(json.data);
  }
  if (!json.success && json.error !== undefined) {
    return failure(json.error);
  }
  throw new Error('Invalid JSON format for Result');
};

// =============================================================================
// デバッグ・ログ関数
// =============================================================================

/**
 * Resultの内容をコンソールに出力（デバッグ用）
 */
export const tap = <T, E>(
  result: Result<T, E>,
  onSuccess?: (data: T) => void,
  onFailure?: (error: E) => void
): Result<T, E> => {
  if (isSuccess(result) && onSuccess) {
    onSuccess(result.data);
  }
  if (isFailure(result) && onFailure) {
    onFailure(result.error);
  }
  return result;
};

// =============================================================================
// 型定義エクスポート（再エクスポート）
// =============================================================================

export type {
  Result,
  Success,
  Failure,
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
};