import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";



export class Account extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["account"]);
    new Component(this.root, 'h1', ["account__title"], "Личный аккаунт");

  }
}