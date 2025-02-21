import { Link } from 'react-router-dom';
import { BookOutlined } from '@ant-design/icons';
import { ROUTERS } from '@shared/constants';
import LogoIcon from '../icons/logo.svg?react';

import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to={ROUTERS.ROOT} className={styles.headerLink}>
        <LogoIcon width={32} height={32} />
      </Link>

      <div className={styles.headerFilter}>Filter</div>

      <div>
        <BookOutlined width={32} height={32} />
      </div>
    </header>
  );
};
