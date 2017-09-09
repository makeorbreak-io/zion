import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServerCommService } from '../../services/serverComm/serverComm.service';
import { SearchResult } from './searchresult';

import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';
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
  wsPort: string;
  wsAddress = "ws://138.68.143.160:";
  ws: any

  searchQuery: string;
  selectedSong: SearchResult;
  bidAmount: number;
  topBid: string;
  topSong: string;

  searchResults: SearchResult[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public serverComm: ServerCommService) {
    this.code = this.navParams.get('code');
    this.codeId = this.navParams.get('codeId');
    this.wsPort = this.navParams.get('port');
    this.ws = new $WebSocket(this.wsAddress + this.wsPort);

    this.ws.onMessage(
    (msg: MessageEvent)=> {
        console.log("Received message: ", msg.data);
        
        try{
          let jsonData = JSON.parse(msg.data);
          if(!jsonData.bidId){
            return;
          }

          this.topBid = jsonData.amount;
          this.topSong = jsonData.title + "-" + jsonData.artist;
        }
        catch(e){
          return;
        }

    },
    {autoApply: false});
  }

  sendMsg(){
    console.log("AMANDEI MESMO");
    this.ws.send("AMANDEI UMA CENA").subscribe(lol => console.log(lol));
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
    if(isNaN(this.bidAmount) || this.bidAmount <= 0 || this.bidAmount <= parseInt(this.topBid)){
      return;
    }
    console.log("biba");
    if(!this.selectedSong){
      return;
    }
    this.serverComm.bid(this.codeId, this.selectedSong.songUri, this.bidAmount, this.selectedSong.name, this.selectedSong.artist).subscribe(
      res => {
        console.log(res);
        this.bidAmount = 0;
      },
      err => console.log("Error: " + err)

    );
  }
}
