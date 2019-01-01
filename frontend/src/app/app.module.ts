import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
/*import { CesiumDirective } from './directives/cesium/cesium.directive';*/
import { UIComponent } from './components/ui/ui.component';
import { UIP5Component } from './components/ui-p5/ui-p5.component';
import { MessageListComponent } from './components/message-list/message-list.component';
/*import {MatDialogModule} from '@angular/material';*/

@NgModule({
  declarations: [
    AppComponent,
    UIComponent,
    UIP5Component,
    MessageListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
    /*MatDialogModule*/
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [/*PopupComponent*/]
})
export class AppModule { }
