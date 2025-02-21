import { Suras } from '@entities/suras';
import { Space, Tag } from 'antd';

import styles from './ListSurah.module.scss';

type Props = Suras;

export const Surah = ({ text, verses, words, chars, sajda, id }: Props) => {
  return (
    <div className={styles.surah}>
      <div className={styles.surahNumber}>{id}</div>

      <div>
        <div>{text.tr}</div>
        <Space>
          <Tag color="green">{`verses: ${verses}`}</Tag>
          <Tag color="blue">{`words: ${words}`}</Tag>
          <Tag color="purple">{`chars: ${chars}`}</Tag>
          {sajda && sajda.length > 0 && <Tag color="gold">sajda</Tag>}
        </Space>
      </div>

      <div></div>
    </div>
  );
};
