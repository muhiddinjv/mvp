import { useEffect, useState } from 'react';
import { useSurasStore } from '@entities/suras';

export const useLoadingSuras = (surasJsonLink: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const setSuras = useSurasStore(state => state.setSuras);

  const loadingSuras = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(surasJsonLink);
      const json = await response.json();

      setSuras(json);
    } catch (error: Error | unknown) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadingSuras();
  }, []);

  return {
    isLoading,
  };
};
