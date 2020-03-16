import {
  Withdrawal,
  SubmitTransaction,
  WithdrawalKeyPress,
  ClearWithdrawalSubmission,
  SelectPage,
  DepositKeyPress,
  ClearDepositSubmission,
  SelectBill
} from './actions/atm.actions';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Bill } from 'src/shared/models/bill-type.model';
import { BillType } from 'src/shared/models/bill-type.enum';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { AtmError } from 'src/shared/models/atm-error.enum';
import { Injectable } from '@angular/core';
import { Transaction } from 'src/shared/models/transaction.model';
import { tokenReference } from '@angular/compiler';
export interface AtmStateModel {
  remainingAmount: Bill[];
  transactions: Transaction[];
  withdrawalAmount: number[];
  depositAmount: number[];
  submitted: boolean;
  bill: Bill;
  page: 'withdrawal' | 'deposit' | 'overview';
}
@Injectable()
@State<AtmStateModel>({
  name: 'atm',
  defaults: {
    remainingAmount: [
      new Bill(BillType.HUNDRED, 100, 10),
      new Bill(BillType.FIFTY, 50, 10),
      new Bill(BillType.TWENTY, 20, 10),
      new Bill(BillType.TEN, 10, 10),
      new Bill(BillType.FIVE, 5, 10),
      new Bill(BillType.ONE, 1, 10)
    ],
    transactions: [],
    withdrawalAmount: [],
    depositAmount: [],
    submitted: false,
    bill: null,
    page: null
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
      this.store.dispatch(
        new SubmitTransaction({
          error: AtmError.INSUFFICIENT_FUNDS,
          action: 'withdrawal'
        })
      );
    } else {
      const billsToDispense = AtmUtility.getBillsForWithdrawal(
        [...atmState.remainingAmount],
        requestedValue
      );
      // check to see if we were able to make change
      if (!billsToDispense) {
        this.store.dispatch(
          new SubmitTransaction({
            error: AtmError.UNABLE_TO_MAKE_CHANGE,
            action: 'withdrawal'
          })
        );
      } else {
        const updatedRemainingAmount = atmState.remainingAmount.map(bill => {
          const billToRemove = billsToDispense.find(
            billTR => bill.name === billTR.name
          );
          if (billToRemove) {
            bill.amount = bill.amount - billToRemove.amount;
          }
          return bill;
        });
        ctx.patchState({ remainingAmount: updatedRemainingAmount });
        this.store.dispatch(
          new SubmitTransaction({
            bills: billsToDispense,
            action: 'withdrawal'
          })
        );
      }
    }
    ctx.patchState({ withdrawalAmount: [] });
  }

  @Action(SubmitTransaction)
  submitTransaction(
    ctx: StateContext<AtmStateModel>,
    { result }: SubmitTransaction
  ): void {
    const atmState = ctx.getState();
    atmState.transactions = [...atmState.transactions, result];
    atmState.submitted = true;
    ctx.setState({ ...atmState });
  }

  @Action(ClearWithdrawalSubmission)
  clearWithdrawalSubmission(ctx: StateContext<AtmStateModel>) {
    ctx.patchState({ withdrawalAmount: [], submitted: false });
  }

  @Action(ClearDepositSubmission)
  clearDepositSubmission(ctx: StateContext<AtmStateModel>) {
    ctx.patchState({ depositAmount: [], submitted: false });
  }
  @Action(DepositKeyPress)
  depositKeyPress(
    ctx: StateContext<AtmStateModel>,
    { key, addedBill }: DepositKeyPress
  ) {
    const atmState = ctx.getState();
    if (key === 'clear') {
      this.store.dispatch(new ClearDepositSubmission());
    } else if (key === 'submit') {
      const updatedRemainingAmount = atmState.remainingAmount.map(bill => {
        if (bill.name === addedBill.name) {
          bill.amount = bill.amount + addedBill.amount;
        }
        return bill;
      });
      this.store.dispatch(
        new SubmitTransaction({ bills: [addedBill], action: 'deposit' })
      );

      this.store.dispatch(new ClearDepositSubmission());
      ctx.patchState({
        remainingAmount: updatedRemainingAmount,
        submitted: true
      });
    } else {
      ctx.patchState({
        depositAmount: [...atmState.depositAmount, Number(key)]
      });
    }
  }

  @Action(WithdrawalKeyPress)
  withdrawalKeyPress(
    ctx: StateContext<AtmStateModel>,
    { key }: WithdrawalKeyPress
  ) {
    const atmState = ctx.getState();
    if (key === 'clear') {
      this.store.dispatch(new ClearWithdrawalSubmission());
    } else if (key === 'submit') {
      this.store.dispatch(
        new Withdrawal(
          AtmUtility.convertWithdrawalAmountToNumber(atmState.withdrawalAmount)
        )
      );
    } else {
      ctx.patchState({
        withdrawalAmount: [...atmState.withdrawalAmount, Number(key)]
      });
    }
  }
  @Action(SelectPage)
  selectPage(ctx: StateContext<AtmStateModel>, { page }: SelectPage) {
    ctx.patchState({ page });
  }
  @Action(SelectBill)
  selectBill(ctx: StateContext<AtmStateModel>, { bill }: SelectBill) {
    ctx.patchState({ bill, submitted: false });
    this.store.dispatch(new ClearDepositSubmission());
  }
}
