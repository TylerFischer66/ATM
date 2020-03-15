import { Bill } from '../models/bill-type.model';
import { BillType } from '../models/bill-type.enum';

export class AtmUtility {
  /**
   * Determines if enough founds exist for the transaction.
   */
  static enoughFundsRemaining(
    remainingBills: Bill[],
    requestedAmount: number
  ): boolean {
    return AtmUtility.calculateCashValue(remainingBills) > requestedAmount;
  }
  /**
   * gets the cash sum of all remaining bills.
   */
  static calculateCashValue(remainingBills: Bill[]): number {
    return remainingBills.reduce((total, bill) => {
      return total + bill.value;
    }, 0);
  }
  /**
   * Have it start at each bill type
   */
  static getBillsForWithdrawal(
    remainingBills: Bill[],
    requestedAmount: number
  ): Bill[] {
    return [
      new Bill(BillType.HUNDRED, 100, 0),
      new Bill(BillType.FIFTY, 50, 0),
      new Bill(BillType.TWENTY, 20, 0),
      new Bill(BillType.TEN, 10, 0),
      new Bill(BillType.FIVE, 5, 0),
      new Bill(BillType.ONE, 1, 0)
    ]
      .map(startValue => {
        const response = AtmUtility.getBillsForWithdrawHelper(
          AtmUtility.makeClone(remainingBills),
          requestedAmount,
          [startValue]
        );
        remainingBills.shift();
        return response;
      })
      .find(hasValue => hasValue);
  }
  static getBillsForWithdrawHelper(
    remainingBills: Bill[],
    requestedAmount: number,
    billsUsed: Bill[]
  ): Bill[] {
    if (requestedAmount === 0) {
      // successful base case, return the bills used
      return billsUsed;
    }
    // try to take the same type of bill
    if (
      remainingBills[0].amount > 0 &&
      remainingBills[0].multiplier <= requestedAmount
    ) {
      remainingBills[0].takeBill(1);
      requestedAmount = requestedAmount - remainingBills[0].multiplier;
      // update the bills that are used
      billsUsed[billsUsed.length - 1].giveBill(1);
      return this.getBillsForWithdrawHelper(
        AtmUtility.makeClone(remainingBills),
        requestedAmount,
        AtmUtility.makeClone(billsUsed)
      );
    }
    // couldn't get the amount on the current bill so move on to the next one
    if (remainingBills.length > 1) {
      // moving to the next bill type
      remainingBills.shift();

      billsUsed.push(
        new Bill(remainingBills[0].name, remainingBills[0].multiplier, 0)
      );
      return this.getBillsForWithdrawHelper(
        AtmUtility.makeClone(remainingBills),
        requestedAmount,
        AtmUtility.makeClone(billsUsed)
      );
    }
  }
  /**
   * One flaw of using classes with recursive calls is that the objects
   * being passed in don't clone easily.
   * This was a solution to make them act immutable.
   *
   */
  private static makeClone(original: Bill[]) {
    return original.map(bill => {
      return Object.assign(Object.create(Object.getPrototypeOf(bill)), bill);
    });
  }
}
