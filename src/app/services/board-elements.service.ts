import { Injectable, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import type { ConcreteSlabComponent } from '../components/board/board-elements/subsoil/concrete-slab/concrete-slab.component';
import { type GrassComponent } from '../components/board/board-elements/subsoil/grass/grass.component';
import type { DTO } from './http.service';
import { CollectionName, HttpService } from './http.service';

export type BoardElementDTO = DTO & {
  type: 'grass' | 'concreteSlab';
  options: {
    xPosition: number;
    yPosition: number;
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
        boardElementsDTO.map((boardElementDTO) =>
          this.updateElements(boardElementDTO),
        );
      });
  }

  addElement(componentType: keyof typeof boardComponents): void {
    this.httpService
      .post<BoardElementDTO>(CollectionName.BoardElements, {
        type: componentType,
        options: { xPosition: 0.5, yPosition: 0.5 },
      })
      .pipe(take(1))
      .subscribe((boardElementDTO) =>
        this.updateElements(boardElementDTO, true),
      );
  }

  toggleActiveElement(id: BoardElementDTO['id']): void {
    this.elements.update((elements) => {
      return elements.map((element) => {
        element.isActive = element.id === id ? !element.isActive : false;
        return element;
      });
    });
  }

  private async updateElements(
    { id, type, options }: BoardElementDTO,
    setNewElementAsActive?: boolean,
  ): Promise<void> {
    const component: BoardComponent = await boardComponents[type]();

    this.elements.update((elements) => {
      if (setNewElementAsActive) {
        elements.forEach((element) => {
          element.isActive = false;
        });
      }

      return [
        ...elements,
        { id, type, options, component, isActive: setNewElementAsActive },
      ];
    });
  }
}
