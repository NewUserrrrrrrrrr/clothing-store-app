import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";



export class Catalog extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["catalog"]);
    new Component(this.root, 'h1', ["catalog__title"], "Каталог товаров");
  }
}