import { Component, OnInit } from '@angular/core';
import { GroceriesService } from 'src/app/services/groceries/groceries.service';
import { Grocery } from 'src/app/models/grocery.model';
import { StoresService } from 'src/app/services/stores/stores.service';
import { Store } from 'src/app/models/store.model';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  selectedStore: Store;

  constructor(
    private storesService: StoresService,
    private groceriesService: GroceriesService
  ) {}

  get groceries(): Grocery[] {
    return this.groceriesService.groceries;
  }

  get stores(): Store[] {
    return this.storesService.stores;
  }
}
