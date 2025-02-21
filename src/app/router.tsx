import { createBrowserRouter } from 'react-router-dom';
import { Home } from '@pages/home';
import { NotFoundPage } from '@pages/NotFound.page';
import { ROUTERS } from '@shared/constants';
import { AppLayout } from './layouts/app-layout';
import { AppLoader } from './loaders/AppLoader';
import { AppProvider } from './providers/AppProvider';

export const router = createBrowserRouter([
  {
    element: (
      <AppLoader>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </AppLoader>
    ),
    children: [
      {
        path: ROUTERS.ROOT,
        element: <Home />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
