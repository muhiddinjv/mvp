import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownOutlined, ArrowUpOutlined, ColumnHeightOutlined } from '@ant-design/icons';
import { SortDirection, useSortSuras, useSurasStore } from '@entities/suras';
import { Button, Flex } from 'antd';

import styles from './ListSurah.module.scss';

const derctionIcons: Record<SortDirection, ReactNode> = {
  up: <ArrowUpOutlined />,
  down: <ArrowDownOutlined />,
  none: <ColumnHeightOutlined />,
};

export const ListSurahSort = () => {
  const { t } = useTranslation();
  const sortedKeysDirection = useSurasStore(state => state.sortedKeysDirection);
  const { onSortByWords, onSortBySajda, onSortByVerses, onSortById } = useSortSuras();

  return (
    <div className={styles.surah}>
      <Button
        variant="filled"
        block
        icon={derctionIcons[sortedKeysDirection['id']]}
        iconPosition="end"
        onClick={onSortById}
      >
        #
      </Button>

      <Flex gap="small">
        <Button
          color="green"
          variant="filled"
          block
          icon={derctionIcons[sortedKeysDirection['verses']]}
          iconPosition="end"
          onClick={onSortByVerses}
        >
          {t('surah')}
        </Button>
        <Button
          color="gold"
          variant="filled"
          block
          icon={derctionIcons[sortedKeysDirection['sajda']]}
          iconPosition="end"
          onClick={onSortBySajda}
        >
          {t('sajda')}
        </Button>
        <Button
          color="blue"
          variant="filled"
          block
          icon={derctionIcons[sortedKeysDirection['words']]}
          iconPosition="end"
          onClick={onSortByWords}
        >
          {t('word')}
        </Button>
      </Flex>

      <div></div>
    </div>
  );
};
