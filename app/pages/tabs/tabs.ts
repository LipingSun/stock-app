import {Page} from 'ionic-angular';
import {Page1} from '../page1/page1';
import {PricePage} from '../price/price';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabPriceRoot: any = PricePage;
  tab1Root: any = Page1;
}
