import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroceryListComponent } from './components/grocery-list/grocery-list.component';
import { StoresComponent } from './components/stores/stores.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/grocery-list',
    pathMatch: 'full'
  },
  {
    path: 'grocery-list',
    component: GroceryListComponent
  },
  {
    path: 'stores',
    component: StoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
