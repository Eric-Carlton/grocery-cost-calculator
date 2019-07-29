import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { plainToClass } from 'class-transformer';

import { Store } from '../../models/store.model';

import { environment } from '../../../environments/environment';
import { ReplaySubject, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private _stores: ReplaySubject<Store[]> = new ReplaySubject(1);

  constructor(private http: HttpClient) {
    this.refreshStores();
  }

  get stores() {
    return this._stores.asObservable();
  }

  private refreshStores() {
    this.http.get(environment.storesEndpoint).subscribe((stores: Object[]) => {
      this._stores.next(plainToClass(Store, stores));
    });
  }

  addStore(store: Store) {
    this.http.post(environment.storesEndpoint, store).subscribe(() => {
      this.refreshStores();
    });
  }

  updateStore(store: Store) {
    this.http
      .put(`${environment.storesEndpoint}/${store.id}`, store)
      .subscribe(() => {
        this.refreshStores();
      });
  }

  deleteStore(store: Store) {
    this.http
      .delete(`${environment.storesEndpoint}/${store.id}`)
      .subscribe(() => {
        this.refreshStores();
      });
  }
}
