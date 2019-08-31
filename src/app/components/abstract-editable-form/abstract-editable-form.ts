import { ViewChild, Component } from '@angular/core';
import { CrudItem } from 'src/app/models/crud-item.model';
import { CrudService } from 'src/app/services/crud/crud.service';
import { EditableItem } from 'src/app/models/editable-item.model';
import { cloneDeep } from 'lodash';
import { NgForm } from '@angular/forms';

@Component({})
export abstract class AbstractEditableFormComponent<T extends CrudItem> {
  @ViewChild('editableForm', { static: true }) form: NgForm;
  protected rows: T[] & EditableItem[] = [];

  constructor(protected crudService: CrudService<T>) {
    this.crudService.collection$.subscribe(rows => {
      this.rows = cloneDeep(rows) as T[] & EditableItem[];
    });
  }

  protected toggleEditable(row: T & EditableItem): void {
    // if a row does not have an ID, then you can't cancel an edit - you can only remove it from the form
    if (row.id) {
      if (row.editable) {
        const control = this.form.controls[this.rows.indexOf(row) + 1];
        control.markAsUntouched();
        control.markAsPristine();
        this.crudService.collection$.subscribe(rows => {
          const uneditedRow = rows.find(original => original.id === row.id);

          // Don't change the values of any properties associated with
          // form functions - only revert properties associated with the
          // underlying CRUD item
          for (const property in uneditedRow) {
            (row as T)[property] = uneditedRow[property];
          }
        });
      }
      row.editable = !row.editable;
    } else {
      this.rows.splice(this.rows.indexOf(row), 1);
    }
  }

  protected anyRowsEdited(): boolean {
    return this.rows.some(
      (row: EditableItem) => row.editable || row.markedForDeletion
    );
  }

  protected addRow() {
    const newRow = new EditableItem();
    newRow.editable = true;

    this.rows.push(newRow);
  }

  protected toggleMarkForDeletion(row: EditableItem) {
    row.markedForDeletion = !row.markedForDeletion;
    if (row.markedForDeletion && row.editable) {
      this.toggleEditable(row as T & EditableItem);
    }
  }

  protected onSubmit() {
    this.rows
      .filter(row => !row.id)
      .forEach(row => {
        this.crudService.create(row);
      });
    this.rows
      .filter(
        (row: T & EditableItem) =>
          row.id && row.editable && !row.markedForDeletion
      )
      .forEach(row => this.crudService.update(row));
    this.rows
      .filter((row: T & EditableItem) => row.markedForDeletion)
      .forEach(row => this.crudService.delete(row));
  }
}
