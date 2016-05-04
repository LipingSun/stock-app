import {Page, NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the Search page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Page({
    templateUrl: 'build/pages/search-page/search-page.html',
})
export class SearchPage {
    constructor(public nav:NavController, public navParams:NavParams) {
    }

    selectStock() {
        this.navParams.data.symbol = 'AAPL';
        this.nav.pop();
    }
}
