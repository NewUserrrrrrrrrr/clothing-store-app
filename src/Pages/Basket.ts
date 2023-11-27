import { Component } from "../Abstract/Component";
import { TDataBasket, TGoodBasket, TServices } from "../Abstract/Type";
import { CardBasket } from "../Common/CardBasket";



export class Basket extends Component {
  nullBasket: Component;
  fullBasket: Component;
  divBasket: Component;
  spanSumma: Component;
  spanPercent: Component;
  spanAllSumma: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["basket"]);
    new Component(this.root, 'h1', ["basket__title"], "Корзина");

    services.dbService.calcDataBasket();
    let isBasketClear = false;
    if (services.dbService.dataUser) {
      if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
    }

    this.nullBasket = new Component(this.root, 'h1', ["nullbasket"], "Корзина пуста");

    this.fullBasket = new Component(this.root, 'div', ["fullbasket"]);
    this.toggleBasket(isBasketClear);
    this.divBasket = new Component(this.fullBasket.root, 'div', ["basket__goods"]);
    if (services.dbService.dataUser) {
      services.dbService.dataUser.basket.forEach(el => {
        this.putGoodsInBasket(this.divBasket, el);
      });
    };
    new Component(this.fullBasket.root, 'span', [], "Предоставляется скидка при покупке от 100 рублей -3%, при покупке от 200 рублей-7%.");

    const total = new Component(this.fullBasket.root, 'div', ["total__basket-inner"]);
    this.spanSumma = new Component(total.root, 'span', ["basket-sum"], `Итого сумма: ${services.dbService.dataBasket.summa} руб`);
    this.spanPercent = new Component(total.root, 'span', ["basket-sum"], `Скидка: ${services.dbService.dataBasket.summa * services.dbService.dataBasket.percent / 100} руб`);
    this.spanAllSumma = new Component(total.root, 'span', ["basket-sum"], `Итого сумма со скидкой: ${services.dbService.dataBasket.allSumma} руб`);

    const btnOplata = new Component(total.root, 'input', ["basket__oplata"], null, ["type", "value"], ["button", "Оплатить"]);
    btnOplata.root.onclick = () => {
      const user = services.authService.user;
      services.dbService.addBasketInHistory(user);
    };

    services.dbService.addListener('goodInBasket', (tovar) => {//при команде "bookInBasket"
      this.putGoodsInBasket(this.divBasket, tovar as TGoodBasket);
      this.toggleBasket(true);
    });

    services.dbService.addListener('changeDataBasket', (dataBasket) => {//при изменении в корзине
      this.spanSumma.root.innerHTML = `Итого сумма: ${(dataBasket as TDataBasket).summa} руб`;
      this.spanPercent.root.innerHTML = `Скидка: ${((dataBasket as TDataBasket).summa * (dataBasket as TDataBasket).percent / 100)} руб`;
      this.spanAllSumma.root.innerHTML = `Итого сумма со скидкой: ${(dataBasket as TDataBasket).allSumma} руб`;
      let isBasketClear = false;
      if (services.dbService.dataUser) {
        if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
      }
      this.toggleBasket(isBasketClear);
    });

    services.dbService.addListener("clearBasket", () => {//очистить корзину
      this.divBasket.root.innerHTML = '';
      this.toggleBasket(false);
    });
  }
  putGoodsInBasket(teg: Component, tovar: TGoodBasket) {
    new CardBasket(teg.root, this.services, tovar);
  }
  toggleBasket(isBasketClear: boolean) {
    if (isBasketClear) {
      this.nullBasket.remove();
      this.fullBasket.render();
    } else {
      this.nullBasket.render();
      this.fullBasket.remove();
    }
  }
}