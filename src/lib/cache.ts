import { unstable_cache as cache } from "next/cache";

interface CacheOptions {
  revalidate?: number;
  tags?: string[];
}

/**
 * Cria uma versão cacheada de qualquer função async.
 * @param fn Função assíncrona a ser cacheada.
 * @param tags Tags para revalidação
 * @param options Opções de cache (revalidate em segundos)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  tags: string[],
  options: CacheOptions = {}
): T {
  const { revalidate = 30 } = options; // Reduzindo o tempo padrão para 30 segundos
  return cache(fn, tags, { revalidate }) as T;
}
