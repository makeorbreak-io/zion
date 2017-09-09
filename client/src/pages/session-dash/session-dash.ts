import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.sessionId = this.navParams.get('sessionId');
    this.sessionCode = this.navParams.get('code');
  }

  genClientCode(){
    
  }
}
