import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';




@Injectable()
export class ServerCommService{

  mainUrl: string = "http://138.68.143.160:8000";

  constructor(public http: Http){};

  validateSessionCode(code){
    let validateSessUrl = "/validatesession";

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainUrl+validateSessUrl, JSON.stringify({'code': code}), options).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  generateClientCode(sessionId){
    let genCodeUrl = "/clientcode";

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();
    params.append({'sessId': sessionId});

    let options = new RequestOptions({ headers: headers });

    return this.http.get(this.mainUrl+this.genCodeUrl, options).map((res: Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }
}
()
