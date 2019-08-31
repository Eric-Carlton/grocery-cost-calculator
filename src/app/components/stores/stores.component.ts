import { Component } from '@angular/core';
import { StoresService } from 'src/app/services/stores/stores.service';
import { Store } from 'src/app/models/store.model';
import { AbstractEditableForm } from '../abstract-editable-form/abstract-editable-form';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent extends AbstractEditableForm<Store> {
  constructor(protected storesService: StoresService) {
    super(storesService);
  }

  get storeNames(): string[] {
    return this.rows.map(store => store.name);
  }
}
