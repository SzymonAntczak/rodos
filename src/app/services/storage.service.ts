import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';
import uniqid from 'uniqid';

export enum CollectionName {
  BoardElements = 'rodos.boardElements',
  Boards = 'rodos.boards',
}

export type DTO = {
  id: string;
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItems<T extends DTO>(collectionName: CollectionName): Observable<T[]> {
    const collectionRaw = localStorage.getItem(collectionName);
    const collection: T[] = collectionRaw ? JSON.parse(collectionRaw) : [];

    return of(collection);
  }

  getItem<T extends DTO>(
    collectionName: CollectionName,
    id: DTO['id'],
  ): Observable<T | undefined> {
    return this.getItems<T>(collectionName).pipe(
      map((collection) => collection.find((item) => item.id === id)),
    );
  }

  createItem<T extends DTO>(
    collectionName: CollectionName,
    body: Omit<T, 'id'>,
  ): Observable<T> {
    return this.getItems<T>(collectionName).pipe(
      map((collection) => {
        const item = {
          id: uniqid(),
          ...body,
        } as T;

        collection.push(item);

        localStorage.setItem(collectionName, JSON.stringify(collection));

        return item;
      }),
    );
  }

  updateItem<T extends DTO>(
    collectionName: CollectionName,
    id: DTO['id'],
    body: Partial<Omit<T, 'id'>>,
  ): Observable<T> {
    return this.getItems<T>(collectionName).pipe(
      map((collection) => {
        let item = collection.find((item) => item.id === id);

        if (!item) throw new Error('Item not found');

        item = {
          ...item,
          ...body,
        };

        localStorage.setItem(collectionName, JSON.stringify(collection));

        return item;
      }),
    );
  }

  deleteItem<T extends DTO>(
    collectionName: CollectionName,
    id: DTO['id'],
  ): Observable<T[]> {
    return this.getItems<T>(collectionName).pipe(
      map((collection) => {
        const filtered = collection.filter((item) => item.id !== id);

        localStorage.setItem(collectionName, JSON.stringify(filtered));

        return filtered;
      }),
    );
  }

  dropCollection(collectionName: CollectionName): Observable<void> {
    return of(localStorage.removeItem(collectionName));
  }
}
