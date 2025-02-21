import { useSurasStore } from '@entities/suras';
import { Surah } from './Surah';

import styles from './ListSurah.module.scss';

export const ListSurah = () => {
  const sortedSuras = useSurasStore(state => state.sortedSuras);

  console.log(sortedSuras);

  return (
    <div className={styles.listSurah}>
      {sortedSuras.map(surah => (
        <Surah key={surah.id} {...surah} />
      ))}
    </div>
  );
};
