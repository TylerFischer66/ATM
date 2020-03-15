import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { AtmError } from 'src/shared/models/atm-error.enum';
import { Bill } from 'src/shared/models/bill-type.model';
import { ClearWithdrawalSubmission } from 'src/store/actions/atm.actions';

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
  /*
   * Since a successful result will have be an array of bills
   * check to see if the length property exist on the object.
   */
  noTransactionError(result: Bill[] | AtmError): boolean {
    return result && result.hasOwnProperty('length');
  }
}
