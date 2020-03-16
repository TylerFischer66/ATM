import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { AtmError } from 'src/shared/models/atm-error.enum';
import { Bill } from 'src/shared/models/bill-type.model';
import {
  ClearWithdrawalSubmission,
  SelectPage,
  ClearDepositSubmission
} from 'src/store/actions/atm.actions';
import { Transaction } from 'src/shared/models/transaction.model';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {
  amount$: Observable<number>;
  latestTransaction$: Observable<Bill | AtmError>;
  showTransactionResult = false;
  submitted$: Observable<boolean>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new ClearWithdrawalSubmission());
    this.store.dispatch(new ClearDepositSubmission());
    this.store.dispatch(new SelectPage('withdrawal'));
    this.amount$ = this.store
      .select(state => state.atm.withdrawalAmount)
      .pipe(
        map((amount: number[]) => {
          return AtmUtility.convertWithdrawalAmountToNumber(amount);
        })
      );
    this.latestTransaction$ = this.store
      .select(state => state.atm.transactions)
      .pipe(map(transactions => transactions[transactions.length - 1]));

    this.submitted$ = this.store.select(state => state.atm.submitted);
  }
}
