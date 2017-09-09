import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BidPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-bid',
  templateUrl: 'bid.html',
})
export class BidPage {

  codeId: string;
  code: string;

  searchQuery: string;
  selectedSong: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.code = this.navParams.get('code');
    this.codeId = this.navParams.get('codeId');
  }

}
