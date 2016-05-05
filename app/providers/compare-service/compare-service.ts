import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import 'rxjs/add/operator/map';
import {COMPARE_API} from "../../config";

@Injectable()
export class CompareService {

    constructor(public http:Http) {
    }

    compare(compare) {
        let data = {
            stockA: compare.stocks[0].symbol,
            stockB: compare.stocks[1].symbol,
            days: 90
        };
        let body = JSON.stringify(data);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return new Promise(resolve => {
            this.http.post(COMPARE_API, body, options)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    refresh(compareId) {
        return new Promise(resolve => {
            this.http.get(COMPARE_API + '/' + compareId)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
}

