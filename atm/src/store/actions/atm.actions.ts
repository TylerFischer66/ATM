import { AtmError } from 'src/shared/models/atm-error.enum';
import { Bill } from 'src/shared/models/bill-type.model';

export class Withdrawal {
  static readonly type = '[Atm] Withdraw has been made';
  constructor(public requestedValue: number) {}
}
export class SubmitTransaction {
  static readonly type = '[Atm] Submitting transaction';
  constructor(public result: Bill[] | AtmError) {}
}
export class WithdrawalKeyPress {
  static readonly type = '[Atm] Key pressed for withdrawal';
  constructor(public key: number | string) {}
}
export class ClearWithdrawalSubmission {
  static readonly type = '[Atm] Clearing Withdrawal submission';
}
