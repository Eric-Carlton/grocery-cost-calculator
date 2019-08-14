import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { plainToClass } from 'class-transformer';

import { StoresService } from '../stores/stores.service';

import { Store } from '../../models/store.model';
import { Grocery } from '../../models/grocery.model';

import { environment } from '../../../environments/environment';
import { zip } from 'rxjs';
import { CrudService } from '../crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService extends CrudService<Grocery> {
  constructor(
    protected http: HttpClient,
    private storesService: StoresService
  ) {
    super(http, environment.groceriesEndpoint, Grocery);
    this.refreshCollection();
  }

  protected refreshCollection() {
    zip(
      this.http.get(environment.groceriesEndpoint),
      this.storesService.collection$
    ).subscribe(([groceries, stores]: [Object[], Store[]]) => {
      this.collection = plainToClass(Grocery, groceries).map(grocery =>
        Object.assign(grocery, {
          storeName: stores.find(store => store.id === grocery.storeId).name
        })
      );
      this.sortCollection();
      this.subject.next(this.collection);
    });
  }
}
