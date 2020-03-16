import { Component, OnInit } from '@angular/core';
import { SelectPage } from 'src/store/actions/atm.actions';
import { Store, Select } from '@ngxs/store';
import { Transaction } from 'src/shared/models/transaction.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Select(state => state.atm.transactions) transactions$: Observable<
    Transaction[]
  >;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new SelectPage('overview'));
  }
}
