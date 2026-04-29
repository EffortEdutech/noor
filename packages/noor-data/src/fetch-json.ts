import { getNoorDataConfig } from './config';

export async function fetchJsonWithFallback<T>(url: string, fallback: T): Promise<T> {
  const config = getNoorDataConfig();

  if (config.mode !== 'cdn') {
    return fallback;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 * 60 }
    });

    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}
