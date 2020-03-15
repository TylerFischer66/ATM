import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { AtmState } from 'src/store/atm.state';
import { WithdrawalComponent } from 'src/withdrawal/components/withdrawal.component';
import { NavigationComponent } from 'src/shared/components/navigation/navigation.component';
import { OverviewComponent } from 'src/overview/components/overview.component';
import { KeypadComponent } from 'src/shared/components/keypad/keypad.component';
@NgModule({
  declarations: [
    AppComponent,
    WithdrawalComponent,
    NavigationComponent,
    OverviewComponent,
    KeypadComponent
  ],
  imports: [BrowserModule, AppRoutingModule, [NgxsModule.forRoot([AtmState])]],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
