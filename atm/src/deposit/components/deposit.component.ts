import { Component, OnInit } from '@angular/core';
import {
  SelectPage,
  ClearDepositSubmission,
  ClearWithdrawalSubmission,
  SelectBill
} from 'src/store/actions/atm.actions';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Bill } from 'src/shared/models/bill-type.model';
import { map } from 'rxjs/operators';
import { AtmUtility } from 'src/shared/services/atm-utility.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  @Select(state => state.atm.remainingAmount) remainingBills$: Observable<
    Bill[]
  >;
  @Select(state => state.atm.bill) selectedBill$: Observable<Bill[]>;
  @Select(state => state.atm.submitted) submitted$: Observable<boolean>;
  depositAmount$: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new ClearDepositSubmission());
    this.store.dispatch(new ClearWithdrawalSubmission());
    this.store.dispatch(new SelectPage('deposit'));
    this.depositAmount$ = this.store
      .select(state => state.atm.depositAmount)
      .pipe(
        map((amount: number[]) => {
          return AtmUtility.convertWithdrawalAmountToNumber(amount);
        })
      );
  }
  selectBill(bill: Bill): void {
    this.store.dispatch(new SelectBill(bill));
  }
}
