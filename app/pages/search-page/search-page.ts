import {Page, NavController, NavParams} from 'ionic-angular';
import {Http} from "angular2/http";
import {LOOKUP_API} from "../../config";

@Page({
    templateUrl: 'build/pages/search-page/search-page.html',
})
export class SearchPage {
    items;

    constructor(public nav:NavController, public navParams:NavParams, public http:Http) {
        console.log(this.navParams.data);
    }

    selectStock(symbol) {
        this.navParams.data.symbol = symbol;
        this.nav.pop();
    }

    getItems(searchbar) {

        var keyword = searchbar.value.trim();

        if (keyword == '' || keyword.length < 2) {
            this.items = [];
            return;
        }

        let url = LOOKUP_API + JSON.stringify(keyword);
        console.log(url);
        this.http.get(url).subscribe(
            res => {
                console.log("ok", res.json());
                this.items = res.json();
            },
            err => {
                console.log("err", err.json());
            }
        );
    }
}
