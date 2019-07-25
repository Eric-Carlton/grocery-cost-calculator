import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroceryListComponent } from './components/grocery-list/grocery-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/grocery-list',
    pathMatch: 'full'
  },
  {
    path: 'grocery-list',
    component: GroceryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
