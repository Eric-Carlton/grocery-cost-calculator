import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { plainToClass } from 'class-transformer';

import { StoresService } from '../stores/stores.service';

import { Store } from '../../models/store.model';
import { Grocery } from '../../models/grocery.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {
  private _groceries: Grocery[];

  constructor(private http: HttpClient, private storesService: StoresService) {
    this.refreshGroceries();
  }

  get groceries() {
    return this._groceries;
  }

  private refreshGroceries() {
    this.http
      .get(environment.groceriesEndpoint)
      .subscribe((groceries: Object[]) => {
        this._groceries = plainToClass(Grocery, groceries).map(grocery =>
          Object.assign(grocery, {
            storeName: this.storesService.stores.find(
              store => store.id === grocery.storeId
            ).name
          })
        );
      });
  }
}
