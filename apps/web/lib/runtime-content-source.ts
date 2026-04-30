import { cookies } from 'next/headers';
import { getNoorDataConfig, normalizeNoorDataMode, type NoorDataMode } from '@noor/data';
import { NOOR_CONTENT_SOURCE_COOKIE } from './runtime-content-source-constants';

export {
  NOOR_CONTENT_SOURCE_COOKIE,
  NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY
} from './runtime-content-source-constants';

export async function getServerNoorContentSource(): Promise<NoorDataMode> {
  try {
    const cookieStore = await cookies();
    const selectedSource = cookieStore.get(NOOR_CONTENT_SOURCE_COOKIE)?.value;

    if (selectedSource) {
      return normalizeNoorDataMode(selectedSource);
    }

    return getNoorDataConfig().mode;
  } catch {
    return getNoorDataConfig().mode;
  }
}
