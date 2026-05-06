import { getNoorDataConfig, type NoorDataMode } from './config';

export type NoorFetchOptions = {
  mode?: NoorDataMode;
  allowFallback?: boolean;
  timeoutMs?: number;
  revalidateSeconds?: number;
};

export async function fetchJsonWithFallback<T>(
  url: string,
  fallback: T,
  options: NoorFetchOptions = {}
): Promise<T> {
  const mode = options.mode ?? getNoorDataConfig().mode;
  const allowFallback = options.allowFallback ?? true;

  if (mode === 'mock') {
    return fallback;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 3500);

  try {
    const shouldBypassCache = mode === 'local-cdn' || process.env.NODE_ENV === 'development';

    const response = await fetch(
      url,
      shouldBypassCache
        ? {
            signal: controller.signal,
            cache: 'no-store'
          }
        : {
            signal: controller.signal,
            next: { revalidate: options.revalidateSeconds ?? 60 * 60 }
          }
    );
    
    if (!response.ok) {
      if (allowFallback) return fallback;
      throw new Error(`NOOR content request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (allowFallback) return fallback;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
