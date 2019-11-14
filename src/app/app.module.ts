import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PIXIModule} from './pixi-module/pixi.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PIXIModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
