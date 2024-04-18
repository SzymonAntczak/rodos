import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../app/modules/classic/components/container/container.component'
      ).then((m) => m.ContainerComponent),
  },
  {
    path: 'canvas',
    loadComponent: () =>
      import(
        '../app/modules/canvas/components/container/container.component'
      ).then((m) => m.ContainerComponent),
  },
];
