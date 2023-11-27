import { compareAsc } from "date-fns";
import { Component } from "../Abstract/Component";
import { TGood, TServices } from "../Abstract/Type";

export class Detail extends Component {
  data: TGood | null = null;
  btnBasket: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, 'div', ["detail"]);

    new Component(this.root, 'h1', [], "Карточка товара");

    const divCart = new Component(this.root, 'div', ["detail__cart"]);
    const imgGood = new Component(divCart.root, 'img', [], null, ["src", "alt"], ["", ""]);
    const nameGood = new Component(divCart.root, 'span', ["detail__name"], "");
    const divDetail = new Component(divCart.root, 'span', ["detail__text"], "");
    this.btnBasket = new Component(divCart.root, 'input', ["card__basket"], null, ["value", "type"], ["", "button"]);
    this.btnBasket.root.onclick = () => {
      this.addGoodInBasket();
      (this.btnBasket.root as HTMLElement).classList.add('hidden');
    }


    services.dbService.addListener('updateDetailPage', (good) => {
      this.data = good as TGood;
      (imgGood.root as HTMLImageElement).src = this.data.url;
      (imgGood.root as HTMLImageElement).alt = this.data.name;
      nameGood.root.innerHTML = this.data.name;
      divDetail.root.innerHTML = this.data.detail;

      if (services.dbService.dataUser) {
        const index = services.dbService.dataUser.basket.findIndex((el) => el.good.id === this.data?.id);
        if (index >= 0) {
          (this.btnBasket.root as HTMLElement).classList.add('hidden');
        } else {
          (this.btnBasket.root as HTMLElement).classList.remove('hidden');
        }
      }
    });

    if (services.dbService.dataUser) {
      const index = services.dbService.dataUser.basket.findIndex((el) => el.good.id === this.data?.id);
      if (index >= 0) {
        (this.btnBasket.root as HTMLElement).classList.add('hidden');
      } else {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      }

    }

    services.dbService.addListener('delBookFromBasket', (idGood) => {
      if (this.data && idGood === this.data.id) {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      }
    });

  }

  addGoodInBasket() {
    if (!this.data) {
      (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      return;
    }
    const user = this.services.authService.user; //получаем пользователя
    this.services.dbService.addGoodInBasket(user, this.data)//а затем добавляем карточку книги в корзину
      .catch(() => {
        (this.btnBasket.root as HTMLElement).classList.remove('hidden');
      })
  }

}