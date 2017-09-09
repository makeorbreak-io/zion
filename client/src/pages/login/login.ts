import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SessionDashPage } from '../../pages/session-dash/session-dash';

import { ServerCommService } from '../../services/serverComm/serverComm.service';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  sessCode: string = '';
  spinToggle: boolean = false;
  sessId: string;

  constructor(public navCtrl: NavController, private sComm: ServerCommService) {}

  validateSession(){
    if(this.sessCode.length == 0){
      return;
    }
    this.spinToggle = true;
    this.sComm.validateSessionCode(this.sessCode).subscribe(
      res => {
        console.log(res);
        console.log(this.navCtrl);
        this.spinToggle = false;
        this.navCtrl.push(SessionDashPage, res);
      },
      err => console.log("Error" + err));


  }

}
