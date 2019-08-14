import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { plainToClass } from 'class-transformer';

import { StoresService } from '../stores/stores.service';

import { Store } from '../../models/store.model';
import { Grocery } from '../../models/grocery.model';

import { environment } from '../../../environments/environment';
import { zip, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {
  private _groceries: ReplaySubject<Grocery[]> = new ReplaySubject(1);

  constructor(private http: HttpClient, private storesService: StoresService) {
    this.refreshGroceries();
  }

  get groceries() {
    return this._groceries.asObservable();
  }

  private refreshGroceries() {
    zip(
      this.http.get(environment.groceriesEndpoint),
      this.storesService.stores$
    ).subscribe(([groceries, stores]: [Object[], Store[]]) => {
      this._groceries.next(
        plainToClass(Grocery, groceries).map(grocery =>
          Object.assign(grocery, {
            storeName: stores.find(store => store.id === grocery.storeId).name
          })
        )
      );
    });
  }
}
