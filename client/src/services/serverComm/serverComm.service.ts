import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';




@Injectable()
export class ServerCommService{

  mainUrl: string = "http://138.68.143.160:8000";

  constructor(public http: Http){};

  validateSessionCode(code){
    let validateSessUrl = "/validate";
    let reqParams = new URLSearchParams();
    reqParams.append('sesscode', code);

    let options = new RequestOptions({params: reqParams});

    return this.http.get(this.url+validateSessUrl, options).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  enterSession(code){
    let enterSessUrl = "/enter";

    //let reqParams = new URLSearchParams();
    //reqParams.append('code', code);

    //let options = new RequestOptions({params: reqParams});

    return this.http.post(this.url+validateSessUrl, {'code': code}).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }
}
