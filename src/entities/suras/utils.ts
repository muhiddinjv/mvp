import { SortDirection } from './types';

export function sortNumber(a: number, b: number, direction: SortDirection): number {
  return direction === 'up' ? a - b : b - a;
}
