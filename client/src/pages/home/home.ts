import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { BidPage } from '../bid/bid';
import { SessionDashPage } from '../../pages/session-dash/session-dash';

import { ServerCommService } from '../../services/serverComm/serverComm.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  code: string;

  sessCode: string = '';
  spinToggle: boolean = false;
  sessId: string;

  constructor(public navCtrl: NavController, public serverComm: ServerCommService) {}

  validateSession(){
    if(this.sessCode.length == 0){
      return;
    }
    this.spinToggle = true;
    this.serverComm.validateSessionCode(this.sessCode).subscribe(
      res => {
        console.log(res);
        console.log(this.navCtrl);
        this.spinToggle = false;
        this.navCtrl.push(SessionDashPage, res);
      },
      err => console.log("Error" + err));


  }


  enterSession(){
    if(this.code.length == 0){
      return;
    }
    this.serverComm.validateCode(this.code).subscribe(
      res => {
        this.navCtrl.push(BidPage, res);
      },
      err => console.log("Error: " + err)
    );

  }
}
