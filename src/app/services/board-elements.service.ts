import { Injectable, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import type { ConcreteSlabComponent } from '../components/board/board-elements/subsoil/concrete-slab/concrete-slab.component';
import { type GrassComponent } from '../components/board/board-elements/subsoil/grass/grass.component';
import type { DTO } from './http.service';
import { CollectionName, HttpService } from './http.service';

type BoardElementDTO = DTO & {
  type: 'grass' | 'concreteSlab';
  options: {
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
    layer: number;
  };
};

export type BoardElement = BoardElementDTO & {
  component: BoardComponent;
  isActive?: boolean;
};

export type BoardComponent =
  | typeof GrassComponent
  | typeof ConcreteSlabComponent;

export const boardComponents = {
  grass: () =>
    import(
      '../components/board/board-elements/subsoil/grass/grass.component'
    ).then((m) => m.GrassComponent),
  concreteSlab: () =>
    import(
      '../components/board/board-elements/subsoil/concrete-slab/concrete-slab.component'
    ).then((m) => m.ConcreteSlabComponent),
} satisfies Record<BoardElementDTO['type'], () => Promise<BoardComponent>>;

@Injectable({
  providedIn: 'root',
})
export class BoardElementsService {
  readonly elements = signal<BoardElement[]>([]);

  private readonly httpService = inject(HttpService);

  constructor() {
    this.httpService
      .getItems<BoardElementDTO>(CollectionName.BoardElements)
      .pipe(take(1))
      .subscribe((boardElementsDTO) => {
        boardElementsDTO.forEach(async ({ type, id, options }) => {
          const component: BoardComponent = await boardComponents[type]();

          this.elements.update((elements) => [
            ...elements,
            { id, type, options, component },
          ]);
        });
      });
  }

  addElement(componentType: keyof typeof boardComponents): void {
    this.httpService
      .post<BoardElementDTO>(CollectionName.BoardElements, {
        type: componentType,
        options: {
          xPosition: 0,
          yPosition: 0,
          width: 1,
          height: 1,
          layer: 0,
        },
      })
      .pipe(take(1))
      .subscribe(async ({ type, id, options }) => {
        const component: BoardComponent = await boardComponents[type]();

        this.elements.update((elements) => {
          elements.forEach((element) => {
            element.isActive = false;
          });

          return [
            ...elements,
            { id, type, options, component, isActive: true },
          ];
        });
      });
  }

  toggleActiveElement(id: BoardElement['id']): void {
    this.elements.update((elements) =>
      elements.map((element) => {
        element.isActive = element.id === id ? !element.isActive : false;
        return element;
      }),
    );
  }

  updateElementOptions(
    id: BoardElement['id'],
    options: Partial<BoardElement['options']>,
  ): void {
    this.elements.update((elements) =>
      elements.map((element) => {
        element.options =
          element.id === id
            ? { ...element.options, ...options }
            : element.options;

        return element;
      }),
    );
  }
}
