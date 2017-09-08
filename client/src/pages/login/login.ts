import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, private sComm: ServerCommService) {}

  validateSession(){
    if(this.sessCode.length != 6){
      return;
    }
    this.spinToggle = true;
    this.sComm.validateSessionCode(this.sessCode);
  }

}
