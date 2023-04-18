import React, { ReactElement } from 'react';
import Home from '../pages/home/Home';
import NotFound from '../pages/NotFound/NotFound';

// Types
interface BaseRoute {
  path: string;
  protected?: boolean;
  failureRedirect?: string;
  children?: Route[];
}

interface Element extends BaseRoute {
  element: ReactElement;
  navigate?: never;
}

interface Navigate extends BaseRoute {
  navigate: string;
  element?: never;
}

type Route = Element | Navigate;

// Routes
const routes: Route[] = [
  {
    path: '/:brandURL',
    element: <Home />,
  },
  {
    path: '/',
    element: <NotFound />,
  },
  {
    path: '*',
    navigate: '/',
  },
];

export default routes;
