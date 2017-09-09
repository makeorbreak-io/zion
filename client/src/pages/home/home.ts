import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { BidPage } from '../bid/bid';

import { ServerCommService } from '../../services/serverComm/serverComm.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  code: string;



  constructor(public navCtrl: NavController, public serverComm: ServerCommService) {}

  newSession(){
    this.navCtrl.push(LoginPage);
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
