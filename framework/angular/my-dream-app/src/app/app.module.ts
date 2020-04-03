import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MyComponent.component.tsComponent } from '.e:/wamp/www/items/my-component.component.ts/my-component.component.ts.component';


@NgModule({
  declarations: [
    AppComponent,
    MyComponent.component.tsComponent
],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
