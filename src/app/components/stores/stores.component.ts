import { Component, ViewChild } from '@angular/core';
import { StoresService } from 'src/app/services/stores/stores.service';
import { EditableStore } from 'src/app/models/editable-store.model';
import { NgForm } from '@angular/forms';
import { Store } from 'src/app/models/store.model';
import { EditableFormComponent } from '../editable-form-component/editable-form/editable-form.component';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent extends EditableFormComponent<Store> {
  constructor(protected storesService: StoresService) {
    super(storesService);
  }

  get storeNames(): string[] {
    return this.rows.map(store => store.name);
  }
}
