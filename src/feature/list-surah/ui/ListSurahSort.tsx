import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useSortSuras, useSurasStore } from '@entities/suras';
import { Button, Flex } from 'antd';

import styles from './ListSurah.module.scss';

export const ListSurahSort = () => {
  const sortedKeysDirection = useSurasStore(state => state.sortedKeysDirection);
  const { onSortByWords, onSortBySajda, onSortByVerses, onSortById } = useSortSuras();

  return (
    <div className={styles.surah}>
      <Button
        variant="filled"
        block
        icon={sortedKeysDirection['id'] === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        iconPosition="end"
        onClick={onSortById}
      >
        #
      </Button>

      <div>
        <Flex gap="small">
          <Button
            color="green"
            variant="filled"
            block
            icon={sortedKeysDirection['verses'] === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            iconPosition="end"
            onClick={onSortByVerses}
          >
            Surah
          </Button>
          <Button
            color="gold"
            variant="filled"
            block
            icon={sortedKeysDirection['sajda'] === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            iconPosition="end"
            onClick={onSortBySajda}
          >
            Sajda
          </Button>
          <Button
            color="blue"
            variant="filled"
            block
            icon={sortedKeysDirection['words'] === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            iconPosition="end"
            onClick={onSortByWords}
          >
            Word
          </Button>
        </Flex>
      </div>

      <div></div>
    </div>
  );
};
