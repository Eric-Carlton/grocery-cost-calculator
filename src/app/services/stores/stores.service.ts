import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { plainToClass } from 'class-transformer';

import { Store } from '../../models/store.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private _stores: Store[] = [];

  constructor(private http: HttpClient) {
    this.refreshStores();
  }

  get stores() {
    return this._stores;
  }

  private refreshStores() {
    this.http.get(environment.storesEndpoint).subscribe((stores: Object[]) => {
      this._stores = plainToClass(Store, stores);
    });
  }
}
