import { PropsWithChildren } from 'react';
import { AntProvider } from '@shared/lib/antd';
import { ComposeChildren } from '@shared/lib/react';
import { ToastProvider } from '@shared/lib/toasts';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <ComposeChildren>
      <AntProvider />
      <ToastProvider />
      {children}
    </ComposeChildren>
  );
}
