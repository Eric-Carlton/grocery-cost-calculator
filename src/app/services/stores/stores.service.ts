import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { plainToClass } from 'class-transformer';

import { Store } from '../../models/store.model';

import { environment } from '../../../environments/environment';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private _storesSubject: ReplaySubject<Store[]> = new ReplaySubject(1);
  private _stores: Store[] = [];

  constructor(private http: HttpClient) {
    this.refreshStores();
  }

  get stores$() {
    return this._storesSubject.asObservable();
  }

  private refreshStores() {
    this.http.get(environment.storesEndpoint).subscribe((stores: Object[]) => {
      this._stores = plainToClass(Store, stores);
      this._storesSubject.next(this._stores);
    });
  }

  addStore(store: Store) {
    this.http.post(environment.storesEndpoint, store).subscribe(addedStore => {
      this._stores.push(plainToClass(Store, addedStore));
      this._storesSubject.next(this._stores);
    });
  }

  updateStore(store: Store) {
    this.http
      .put(`${environment.storesEndpoint}/${store.id}`, store)
      .subscribe(updatedStore => {
        this._stores[
          this._stores.findIndex(el => el.id === store.id)
        ] = plainToClass(Store, updatedStore);
        this._storesSubject.next(this._stores);
      });
  }

  deleteStore(store: Store) {
    this.http
      .delete(`${environment.storesEndpoint}/${store.id}`)
      .subscribe(() => {
        this._stores.splice(this._stores.indexOf(store), 1);
        this._storesSubject.next(this._stores);
      });
  }
}
