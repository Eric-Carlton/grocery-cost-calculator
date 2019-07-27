import { Component } from '@angular/core';
import { GroceriesService } from 'src/app/services/groceries/groceries.service';
import { StoresService } from 'src/app/services/stores/stores.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent {
  constructor(
    private storesService: StoresService,
    private groceriesService: GroceriesService,
    private utils: UtilsService
  ) {}
}
