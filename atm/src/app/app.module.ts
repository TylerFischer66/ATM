import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { AtmState } from 'src/store/atm.state';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, [NgxsModule.forRoot([AtmState])]],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
