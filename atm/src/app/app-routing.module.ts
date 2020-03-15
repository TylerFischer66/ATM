import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WithdrawalComponent } from 'src/withdrawal/components/withdrawal.component';
import { DepositComponent } from 'src/deposit/components/deposit.component';
import { OverviewComponent } from 'src/overview/components/overview.component';

const routes: Routes = [
  { path: 'withdrawal', component: WithdrawalComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'overview', component: OverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
