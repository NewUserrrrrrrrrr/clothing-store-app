import { Component } from "../Abstract/Component";
import { TGood, TServices } from "../Abstract/Type";


export class GoodCard extends Component {
  btnBasket: Component
  constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
    super(parrent, 'div', ["card"]);

    const cart = new Component(this.root, 'div', []);
    new Component(cart.root, 'img', [], null, ["src", "alt"], [data.url, data.name]);
    new Component(cart.root, 'span', ["card__name"], data.name);

    (cart.root as HTMLButtonElement).onclick = () => {
      services.dbService.openDetailPage(data);
    }

    const cardRow = new Component(this.root, 'div', ["card__row"]);
    this.btnBasket = new Component(cardRow.root, 'input', ["card__basket"], null, ["value", "type"], ["", "button"]);
    new Component(cardRow.root, 'span', ["card__price"], `${data.price.toString()} руб`);

    if (services.dbService.dataUser) {
      const index = services.dbService.dataUser.basket.findIndex((el) => el.good.id === data.id);
      if (index >= 0) {
        (this.btnBasket.root as HTMLElement).classList.add('hidden')
      }
    }
    this.btnBasket.root.onclick = () => {
      this.addGoodInBasket();
      (this.btnBasket.root as HTMLElement).classList.add('hidden');
    }

    services.dbService.addListener('delGoodFromBasket', (idGood) => {
      if (idGood === data.id) {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      }
    })
  }
  addGoodInBasket() {
    const user = this.services.authService.user;
    this.services.dbService.addGoodInBasket(user, this.data)
      .catch(() => {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      })
  }
}