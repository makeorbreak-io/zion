import { Injectable } from '@angular/core';
import {Http} from '@angular/http';


@Injectable()
export class SpotifyService{

  client_id: string = "ef3393f29a2d47eaa662d0e913abcef5";
  client_secret: string = "05438ca3a01845f59ce0f3bafdfd1f48";
  redirect_uri: string = "http://localhost:8100/callback";

  constructor(http: Http){}

  getAccessToken(){
    
  }

}
