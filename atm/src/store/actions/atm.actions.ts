import { AtmError } from 'src/shared/models/atm-error.enum';
import { Bill } from 'src/shared/models/bill-type.model';
import { BillType } from 'src/shared/models/bill-type.enum';
import { Transaction } from 'src/shared/models/transaction.model';

export class Withdrawal {
  static readonly type = '[Atm] Withdraw has been made';
  constructor(public requestedValue: number) {}
}
export class SubmitTransaction {
  static readonly type = '[Atm] Submitting transaction';
  constructor(public result: Transaction) {}
}
export class WithdrawalKeyPress {
  static readonly type = '[Atm] Key pressed for withdrawal';
  constructor(public key: number | string) {}
}
export class DepositKeyPress {
  static readonly type = '[Atm] Key pressed for deposit';
  constructor(public key: number | string, public addedBill?: Bill) {}
}
export class ClearWithdrawalSubmission {
  static readonly type = '[Atm] Clearing withdrawal submission';
}
export class ClearDepositSubmission {
  static readonly type = '[Atm] Clearing deposit submission';
}
export class SelectPage {
  static readonly type = '[Atm] Selecting new page';
  constructor(public page: 'withdrawal' | 'deposit' | 'overview') {}
}
export class SelectBill {
  static readonly type = '[Atm] Selecting new bill';
  constructor(public bill: Bill) {}
}
