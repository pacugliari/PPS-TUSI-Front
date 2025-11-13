import { routes } from '../../../app.routes';

export const selectableRoutes = routes
  .filter((r) => r.path !== '**' && !r.path?.includes(':'))
  .map((r) => ({
    path: '/' + r.path,
    title: r.title ?? r.path,
  }));
