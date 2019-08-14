import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { CrudItem } from 'src/app/models/crudItem.model';

export abstract class CrudService<T extends CrudItem> {
  protected subject: ReplaySubject<T[]> = new ReplaySubject(1);
  protected collection: T[] = [];

  constructor(
    protected http: HttpClient,
    protected endpoint: string,
    // TODO - gotta be a better way of doing this...
    protected modelClass: ClassType<T>
  ) {}

  get collection$() {
    return this.subject.asObservable();
  }

  protected sortCollection() {
    this.collection.sort((a, b) => a.id - b.id);
  }

  protected refreshCollection() {
    this.http.get(this.endpoint).subscribe((collection: Object[]) => {
      this.collection = plainToClass(this.modelClass, collection);
      this.sortCollection;
      this.subject.next(this.collection);
    });
  }

  create(item: T) {
    this.http.post(this.endpoint, item).subscribe(added => {
      this.collection.push(plainToClass(this.modelClass, added));
      this.sortCollection();
      this.subject.next(this.collection);
    });
  }

  update(item: T) {
    this.http.put(`${this.endpoint}/${item.id}`, item).subscribe(updated => {
      this.collection[
        this.collection.findIndex(el => el.id === item.id)
      ] = plainToClass(this.modelClass, updated);
      this.sortCollection();
      this.subject.next(this.collection);
    });
  }

  deleteStore(item: T) {
    this.http.delete(`${this.endpoint}/${item.id}`).subscribe(() => {
      this.collection.splice(
        this.collection.findIndex(el => el.id === item.id),
        1
      );
      this.sortCollection();
      this.subject.next(this.collection);
    });
  }
}
