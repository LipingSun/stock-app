import {Page} from 'ionic-angular';
import {ComparePage} from '../compare/compare';
import {PricePage} from '../price/price';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabPriceRoot: any = PricePage;
  tabCompareRoot: any = ComparePage;
}
