import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AtmState, AtmStateModel } from 'src/store/atm.state';
import { AtmUtility } from 'src/shared/services/atm-utility.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
