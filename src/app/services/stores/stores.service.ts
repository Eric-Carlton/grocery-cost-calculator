import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { plainToClass } from 'class-transformer';

import { Store } from '../../models/store.model';

import { environment } from '../../../environments/environment';
import { ReplaySubject } from 'rxjs';

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
}
