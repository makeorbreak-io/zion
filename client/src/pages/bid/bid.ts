import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServerCommService } from '../../services/serverComm/serverComm.service';

import { SearchResult } from './searchresult';
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

  showSearch: boolean = true;

  codeId: string;
  code: string;

  searchQuery: string;
  selectedSong: SearchResult;
  bidAmount: number;
  topBid: string;
  topSong: string;

  searchResults: SearchResult[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public serverComm: ServerCommService) {
    this.code = this.navParams.get('code');
    this.codeId = this.navParams.get('codeId');
  }

  search(){
    this.serverComm.search(this.searchQuery, this.codeId).subscribe(
      res => {
        if(!res.results.body){
          this.searchResults = [{name:"No results", artist: "!", songUri: ""}]
        }

        let searchRes = JSON.parse(res.results.body).tracks.items;

        let searchResultsAux = [];

        searchRes.forEach(function(el){
          searchResultsAux.push({'name': el.name, 'artist': el.artists[0].name, "songUri": el.uri})
        })

        this.searchResults = searchResultsAux;
        this.showSearch = true;
        console.log(this.searchResults);
      },
      err => console.log("Error: " + err)
    );
  }

  selectSong(name, artist, song){
    this.selectedSong = {'name': name, "artist": artist, "songUri": song};
    this.showSearch = false;
  }

  makeBid(){

    console.log(this.selectedSong);
    if(isNaN(this.bidAmount) || this.bidAmount <= 0 /*|| menor que o top bid*/ ){
      return;
    }
    console.log("biba");
    if(!this.selectedSong){
      return;
    }
    this.serverComm.bid(this.codeId, this.selectedSong.songUri, this.bidAmount).subscribe(
      res => {
        console.log(res);
        this.bidAmount = 0;
      },
      err => console.log("Error: " + err)

    );
  }
}
