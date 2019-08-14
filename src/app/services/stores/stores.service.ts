import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { plainToClass } from 'class-transformer';

import { Store } from '../../models/store.model';

import { environment } from '../../../environments/environment';
import { CrudService } from '../crud/crud.service';

@Injectable({
  providedIn: 'root'
})
export class StoresService extends CrudService<Store> {
  constructor(protected http: HttpClient) {
    super(http, environment.storesEndpoint, Store);
    this.refreshCollection();
  }
}
