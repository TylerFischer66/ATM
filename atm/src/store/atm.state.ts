import { Withdraw, SetAtmError } from './actions/atm.actions';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Bill } from 'src/shared/models/bill-type.model';
import { BillType } from 'src/shared/models/bill-type.enum';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { AtmError } from 'src/shared/models/atm-error.enum';
import { patch } from '@ngxs/store/operators';
export interface AtmStateModel {
  remainingAmount: Bill[];
  error: AtmError;
  transactions: Bill[];
}
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
    transactions: [

    ]
    error: null
  }
})
export class AtmState {
  constructor(private store: Store) {}

  @Action(Withdraw)
  withdraw(
    ctx: StateContext<AtmStateModel>,
    { requestedValue }: Withdraw
  ): void {
    const atmState = ctx.getState();
    // first check if the atm has enough funds
    if (
      !AtmUtility.enoughFundsRemaining(atmState.remainingAmount, requestedValue)
    ) {
      // if not set an error
      this.store.dispatch(new SetAtmError(AtmError.INSUFFICIENT_FUNDS));
    } else {
      // if were good to go see if we can complete the transaction.
      // this
    }
  }
  @Action(SetAtmError)
  SetAtmError(ctx: StateContext<AtmStateModel>, { error }: SetAtmError): void {
    ctx.patchState({ error });
  }
}
