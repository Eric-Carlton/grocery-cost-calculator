import { Component, ViewChild } from '@angular/core';
import { StoresService } from 'src/app/services/stores/stores.service';
import { cloneDeep } from 'lodash';
import { FormStore } from 'src/app/models/formStore.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent {
  @ViewChild('storesForm', { static: false }) form: NgForm;
  protected stores: FormStore[] = [];

  constructor(protected storesService: StoresService) {
    this.storesService.collection$.subscribe(stores => {
      this.stores = cloneDeep(stores);
    });
  }

  protected toggleEditable(store: FormStore): void {
    // if a store does not have an ID, then you can't cancel an edit - you can only remove it from the form
    if (store.id) {
      if (store.editable) {
        const control = this.form.controls[this.stores.indexOf(store) + 1];
        control.markAsUntouched();
        control.markAsPristine();
        this.storesService.collection$.subscribe(stores => {
          store.name = stores.find(original => original.id === store.id).name;
        });
      }
      store.editable = !store.editable;
    } else {
      this.stores.splice(this.stores.indexOf(store), 1);
    }
  }

  protected anyStoresEdited(): boolean {
    return this.stores.some(store => store.editable);
  }

  protected addStore() {
    const newStore = new FormStore();
    newStore.editable = true;

    this.stores.push(newStore);
  }

  protected deleteStore(store: FormStore) {
    this.storesService.delete(store);
  }

  get storeNames(): string[] {
    return this.stores.map(store => store.name);
  }

  protected onSubmit() {
    this.stores
      .filter(store => !store.id)
      .forEach(store => {
        this.storesService.create(store);
      });
    this.stores
      .filter(store => store.id && store.editable)
      .forEach(store => this.storesService.update(store));
  }
}
