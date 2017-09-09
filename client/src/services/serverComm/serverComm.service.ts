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

    params.append('sessId', sessionId);

    let options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.mainUrl+genCodeUrl, options).map((res: Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  debtLookup(code){
    let debtUrl = "/debt";

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();

    params.append('code', code);

    let options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.mainUrl+debtUrl, options).map((res: Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  validateCode(code){
    let codeValUrl = "/validatecode";

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();

    params.append('code', code);

    let options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.mainUrl+codeValUrl, options).map((res: Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  search(searchQuery, id){
    let searchUrl = "/search";

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();

    params.append('id', id);
    params.append('query', searchQuery);

    let options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.mainUrl+searchUrl, options).map((res: Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  bid(cid, sid, amount, name, artist){
    let bidUrl = "/bid";

    let headers = new Headers({ 'Content-Type': 'application/json' });

    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.mainUrl+bidUrl, JSON.stringify({'cid': cid, 'sid': sid, 'amount': amount, 'title': name, 'artist': artist}),options).map((res: Response) => res.json()).catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}
