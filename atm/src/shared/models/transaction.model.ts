import { Bill } from './bill-type.model';
import { AtmError } from './atm-error.enum';

export interface Transaction {
  bills?: Bill[];
  error?: AtmError;
  action: 'withdrawal' | 'deposit';
}
