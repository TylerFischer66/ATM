import { Component, OnInit } from '@angular/core';
import { SelectPage } from 'src/store/actions/atm.actions';
import { Store, Select } from '@ngxs/store';
import { Transaction } from 'src/shared/models/transaction.model';
import { Observable } from 'rxjs';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { Bill } from 'src/shared/models/bill-type.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Select(state => state.atm.transactions) transactions$: Observable<
    Transaction[]
  >;
  @Select(state => state.atm.remainingAmount) remainingAmount$: Observable<
    Transaction[]
  >;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new SelectPage('overview'));
  }
  calculateCashValue(bills: Bill[]) {
    return AtmUtility.calculateCashValue(bills);
  }
}
