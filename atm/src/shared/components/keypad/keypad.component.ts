import { Component, OnInit } from '@angular/core';
import {
  WithdrawalKeyPress,
  DepositKeyPress
} from 'src/store/actions/atm.actions';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Bill } from 'src/shared/models/bill-type.model';
import { AtmUtility } from 'src/shared/services/atm-utility.service';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.css']
})
export class KeypadComponent implements OnInit {
  hasWithdrawalInput$: Observable<boolean>;
  hasDepositInput$: Observable<boolean>;
  @Select(state => state.atm.page) currentPage$: Observable<boolean>;
  constructor(private store: Store, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.url.subscribe(x => {});
    this.hasWithdrawalInput$ = this.store
      .select(state => state.atm.withdrawalAmount)
      .pipe(map(amount => amount.length > 0));
    this.hasDepositInput$ = this.store
      .select(state => state.atm.depositAmount)
      .pipe(map(amount => amount.length > 0));
  }
  /**
   * When the user presses a key this method determines what to do
   * based off of key type and page.
   *
   */
  onKeyPress(key: string | number): void {
    const currentPage = this.store.selectSnapshot(state => state.atm.page);
    if (currentPage === 'withdrawal') {
      this.store.dispatch(new WithdrawalKeyPress(key));
    }
    if (currentPage === 'deposit') {
      if (key === 'submit') {
        const depositAmount = this.store.selectSnapshot(
          state => state.atm.depositAmount
        );
        const selectedBill = this.store.selectSnapshot(state => state.atm.bill);
        if (!selectedBill) {
          return;
        }
        this.store.dispatch(
          new DepositKeyPress(
            key,
            new Bill(
              selectedBill.name,
              selectedBill.multiplier,
              AtmUtility.convertWithdrawalAmountToNumber(depositAmount)
            )
          )
        );
      } else {
        this.store.dispatch(new DepositKeyPress(key));
      }
    }
  }
}
