import { Component } from "../Abstract/Component";



export class Account extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["account"]);
    new Component(this.root, 'h1', ["account__title"], "Личный аккаунт");

  }
}