import { Withdrawal, SubmitTransaction } from './actions/atm.actions';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Bill } from 'src/shared/models/bill-type.model';
import { BillType } from 'src/shared/models/bill-type.enum';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { AtmError } from 'src/shared/models/atm-error.enum';
import { Injectable } from '@angular/core';
export interface AtmStateModel {
  remainingAmount: Bill[];
  transactions: (Bill[] | AtmError)[];
}
@Injectable()
@State<AtmStateModel>({
  name: 'atm',
  defaults: {
    remainingAmount: [
      new Bill(BillType.HUNDRED, 100, 10),
      new Bill(BillType.FIFTY, 50, 10),
      new Bill(BillType.TWENTY, 20, 0),
      new Bill(BillType.TEN, 10, 10),
      new Bill(BillType.FIVE, 5, 0),
      new Bill(BillType.ONE, 1, 0)
    ],
    transactions: []
  }
})
export class AtmState {
  constructor(private store: Store) {}

  @Action(Withdrawal)
  withdraw(
    ctx: StateContext<AtmStateModel>,
    { requestedValue }: Withdrawal
  ): void {
    const atmState = ctx.getState();
    // first check if the atm has enough funds
    if (
      !AtmUtility.enoughFundsRemaining(atmState.remainingAmount, requestedValue)
    ) {
      // if not set an error
      this.store.dispatch(new SubmitTransaction(AtmError.INSUFFICIENT_FUNDS));
    } else {
      const billsToDispense = AtmUtility.getBillsForWithdrawal(
        atmState.remainingAmount,
        requestedValue
      );
      // check to see if we were able to make change
      if (!billsToDispense) {
        this.store.dispatch(
          new SubmitTransaction(AtmError.UNABLE_TO_MAKE_CHANGE)
        );
      } else {
        this.store.dispatch(new SubmitTransaction(billsToDispense));
      }
    }
  }
  @Action(SubmitTransaction)
  SubmitTransaction(
    ctx: StateContext<AtmStateModel>,
    { result }: SubmitTransaction
  ): void {
    const atmState = ctx.getState();
    const updatedTransactions = [...atmState.transactions, result];
    ctx.patchState({ transactions: updatedTransactions });
  }
}
