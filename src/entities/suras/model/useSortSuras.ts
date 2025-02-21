import { useSurasStore } from '@entities/suras';
import { SortDirection } from '../types';

export const useSortSuras = () => {
  const sortSuras = useSurasStore(state => state.sortSuras);
  const sortedKeysDirection = useSurasStore(state => state.sortedKeysDirection);

  const reverseDirection = (direction?: SortDirection): SortDirection => {
    if (!direction) {
      return 'up';
    }

    return direction === 'up' ? 'down' : 'up';
  };

  const onSortById = () => {
    sortSuras('id', reverseDirection(sortedKeysDirection.id));
  };

  const onSortByVerses = () => {
    sortSuras('verses', reverseDirection(sortedKeysDirection.verses));
  };

  const onSortBySajda = () => {
    sortSuras('sajda', reverseDirection(sortedKeysDirection.sajda));
  };

  const onSortByWords = () => {
    sortSuras('words', reverseDirection(sortedKeysDirection.words));
  };

  return {
    onSortById,
    onSortByVerses,
    onSortBySajda,
    onSortByWords,
  };
};
