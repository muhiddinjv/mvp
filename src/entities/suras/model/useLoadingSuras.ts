import { useEffect, useState } from 'react';
import { useSurasStore } from '@entities/suras';

const getSuras = (surasJsonLink: string) => fetch(surasJsonLink).then(res => res.json());

export const useLoadingSuras = (surasJsonLink: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const setSuras = useSurasStore(state => state.setSuras);

  const loadingSuras = async () => {
    setIsLoading(true);

    try {
      const json = await getSuras(surasJsonLink);

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
