export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; error: E };

export function ok<T>(value: T): Result<T> {
  return { success: true, value };
}

export function err<E = string>(error: E): Result<never, E> {
  return { success: false, error };
}

export function combine(results: Result<unknown>[]): Result<true> {
  for (const result of results) {
    if (!result.success) return result;
  }
  return ok(true);
}

// Helper to unwrap a result or throw
export function unwrap<T>(result: Result<T>): T {
  if (!result.success) throw new Error(result.error as string);
  return result.value;
}
