import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroceryListComponent } from './components/grocery-list/grocery-list.component';
import { StoresComponent } from './components/stores/stores.component';
import { UniqueValidator } from './validators/unique-validator/unique-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    GroceryListComponent,
    StoresComponent,
    UniqueValidator
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
