import { Component } from '@angular/core';
import { GroceriesService } from 'src/app/services/groceries/groceries.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  constructor(
    private storesService: StoresService,
    private groceriesService: GroceriesService
  ) {}
}
