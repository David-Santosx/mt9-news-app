import { unstable_cache as cache } from "next/cache";

/**
 * Cria uma versão cacheada de qualquer função async.
 * @param fn Função assíncrona a ser cacheada.
 * @param tags Tags para revalidação
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  tags: string[]
): T {
  return cache(fn, tags, { revalidate: 60 }) as T;
}
