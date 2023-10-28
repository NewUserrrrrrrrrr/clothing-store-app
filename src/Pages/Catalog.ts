import { Component } from "../Abstract/Component";



export class Catalog extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["catalog"]);
    new Component(this.root, 'h1', ["catalog__title"], "Каталог товаров");
  }
}