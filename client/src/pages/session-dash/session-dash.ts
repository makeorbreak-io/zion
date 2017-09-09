import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServerCommService } from '../../services/serverComm/serverComm.service';

/**
 * Generated class for the SessionDashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-session-dash',
  templateUrl: 'session-dash.html',
})
export class SessionDashPage {

  sessionId: number;
  sessionCode: string;

  newCode: string;
  lookupCode: string;
  debtAmount: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serverComm: ServerCommService) {
    this.sessionId = this.navParams.get('sessionId');
    this.sessionCode = this.navParams.get('code');
  }

  genClientCode(){
    this.serverComm.generateClientCode(this.sessionId).subscribe(
      res => {
        this.newCode = res.code;
      },
      err =>
        console.log("Error: " + err)
    )
  }

  debtLookup(){
    if(this.lookupCode){
      this.serverComm.debtLookup(this.lookupCode).subscribe(
        res => {
          this.debtAmount = res.debt;
        },
        err => console.log("Error: " + err)
      );
    }
    else{
      this.debtAmount = "Not a valid code";
    }

  }

}
