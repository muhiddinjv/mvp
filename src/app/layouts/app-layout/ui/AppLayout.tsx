import { Outlet } from 'react-router-dom';
import { useDetectChangeSystemTheme } from '@shared/theme';
import { Actions } from '@/feature/actions';
import { Header } from '@/feature/header';

import styles from './appLayout.module.scss';

export function AppLayout() {
  useDetectChangeSystemTheme();

  return (
    <div className={styles.appLayout}>
      <div className={styles.center}>
        <Header />

        <div className={styles.content}>
          <Actions />

          <div className={styles.outlet}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
