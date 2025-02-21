import { useSurasStore } from '@entities/suras';
import { Surah } from '@/feature/list-surah/ui/Surah';

export const ListSurah = () => {
  const suras = useSurasStore(state => state.suras);

  console.log(suras);

  return (
    <div>
      {suras.map(surah => (
        <Surah key={surah.id} {...surah} />
      ))}
    </div>
  );
};
