import { CrudItem } from './crud-item.model';

export class Grocery extends CrudItem {
  name: string;
  unit: string;
  costPerUnit: string;
  storeId: number;
  storeName: string;
}
