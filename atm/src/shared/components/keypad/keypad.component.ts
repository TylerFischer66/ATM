import { Component, OnInit } from '@angular/core';
import { WithdrawalKeyPress } from 'src/store/actions/atm.actions';
import { Store } from '@ngxs/store';
import { AtmState } from 'src/store/atm.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.css']
})
export class KeypadComponent implements OnInit {
  hasInput$: Observable<boolean>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.hasInput$ = this.store
      .select(state => state.atm.withdrawalAmount)
      .pipe(map(amount => amount.length > 0));
  }

  onKeyPress(key: string | number): void {
    this.store.dispatch(new WithdrawalKeyPress(key));
  }
}
