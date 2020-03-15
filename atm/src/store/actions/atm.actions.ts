import { AtmError } from 'src/shared/models/atm-error.enum';

export class Withdraw {
  static readonly type = '[Atm] Withdraw has been made';
  constructor(public requestedValue: number) {}
}
export class SetAtmError {
  static readonly type = '[Atm] Error with atm';
  constructor(public error: AtmError) {}
}
