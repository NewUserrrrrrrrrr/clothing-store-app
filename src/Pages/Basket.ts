import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";



export class Basket extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["basket"]);
    new Component(this.root, 'h1', ["basket__title"], "Корзина");
  }
}