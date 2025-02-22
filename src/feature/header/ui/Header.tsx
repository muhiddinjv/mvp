import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ChangeLanguage } from '@entities/change-language';
import { ROUTERS } from '@shared/constants';
import { Button } from 'antd';
import LogoIcon from '../icons/logo.svg?react';

import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link to={ROUTERS.ROOT} className={styles.headerLink}>
        <LogoIcon width={32} height={32} />
      </Link>

      <div className={styles.headerFilter}></div>

      <div className={styles.headerActions}>
        <ChangeLanguage />
        <Button type="primary" shape="circle" icon={<InfoCircleOutlined />} />
      </div>
    </header>
  );
};
