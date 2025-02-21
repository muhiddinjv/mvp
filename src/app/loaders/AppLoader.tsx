import { ReactNode } from 'react';
import { useLoadingSuras } from '@entities/suras';
import { Spinner } from '@shared/ui/Spinner';

const JSON_DATA_LINK = '/json/chapters.json';

export function AppLoader({ children }: { children?: ReactNode }) {
  const { isLoading } = useLoadingSuras(JSON_DATA_LINK);

  return <>{isLoading ? <Spinner isFullScreen /> : children}</>;
}
