import { BillType } from './bill-type.enum';

export class Bill {
  get value(): number {
    return this.amount * this.multiplier;
  }
  constructor(
    public name: BillType,
    public multiplier: number,
    public amount: number
  ) {}

  takeBill(count: number) {
    this.amount = this.amount - 1;
  }
  giveBill(count: number) {
    this.amount = this.amount + 1;
  }
}
