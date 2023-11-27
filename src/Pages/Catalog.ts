import { Component } from "../Abstract/Component";
import { TCriteria, TGood, TServices } from "../Abstract/Type";
import { GoodCard } from "../Common/GoodCard";



export class Catalog extends Component {
  criteria: TCriteria = {
    category: 'all',
    price: 'up'
  }
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["catalog"]);
    new Component(this.root, 'h1', ["catalog__title"], "Каталог товаров");

    const divCrit = new Component(this.root, 'div', ["catalog__criteria"]);
    const divBtn = new Component(divCrit.root, 'div', ["catalog__buttons"]);
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-category"], ["button", "Все товары", "all"])
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-category"], ["button", "Куртки", "куртки"])
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-category"], ["button", "Платья", "платья"])
    new Component(divBtn.root, 'input', ["catalog-btn"], null, ["type", "value", "data-category"], ["button", "Брюки", "брюки"])
    const divSort = new Component(divCrit.root, 'div', ["catalog__sort"]);
    new Component(divSort.root, 'span', [], 'Сортировать товары по цене:');
    const btnSort = new Component(divSort.root, 'input', ["catalog-sort"], null, ["type", "value", "data-price"], ["button", "", "up"]);

    Array.from(divBtn.root.children).forEach((el) => {
      if ((el as HTMLElement).dataset.category === this.criteria.category) {
        (el as HTMLElement).classList.add("active")
      } else {
        (el as HTMLElement).classList.remove("active")
      }
    })
    divBtn.root.onclick = (event) => {
      const param = (event.target as HTMLInputElement).dataset;
      if (!param.category) return;
      if (param.category) {
        this.criteria.category = param.category;
        Array.from(divBtn.root.children).forEach((el) => {
          if ((el as HTMLElement).dataset.category === this.criteria.category) {
            (el as HTMLElement).classList.add("active")
          } else {
            (el as HTMLElement).classList.remove("active")
          }
        })
      }

      services.dbService.getAllGoods(this.criteria).then((goods) => {
        CardCood.root.innerHTML = '';
        this.putGoodOnPage(CardCood, goods);
      });
    }

    btnSort.root.onclick = (event) => {
      const param = (event.target as HTMLElement).dataset;
      if (!param.price) return;
      if (param.price) this.criteria.price = param.price;


      services.dbService.getAllGoods(this.criteria).then((goods) => {
        CardCood.root.innerHTML = '';
        this.putGoodOnPage(CardCood, goods);
      });

      if (param.price === 'up') {
        param.price = 'down';
      } else {
        param.price = 'up';
      }
    }



    const CardCood = new Component(this.root, 'div', ['cardgoods']);
    services.dbService.getAllGoods(this.criteria).then((goods) => {
      this.putGoodOnPage(CardCood, goods);
    });
  }
  putGoodOnPage(teg: Component, goods: TGood[]) {
    goods.forEach((product) => {
      new GoodCard(teg.root, this.services, product);
    })
  }
}