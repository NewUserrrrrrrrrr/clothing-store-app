import { Component } from "../Abstract/Component";



export class Header extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "header", ["header"]);
    const logotip = new Component(this.root, 'a', ["header__logo"], null, ["href"], ["#"]);
    new Component(logotip.root, 'img', null, null, ["src", "alt"], ["./assets/favicon.jpg", "logotip"]);

    const icons = new Component(this.root, 'div', ["header__icons"]);
    const person = new Component(icons.root, 'a', ["header__icon"], null, ["href"], ["#account"]);
    new Component(person.root, 'img', null, null, ["src", "alt"], ["./assets/Icons/Person.svg", "person"]);
    const basket = new Component(icons.root, 'a', ["header__icon"], null, ["href"], ["#basket"]);
    new Component(basket.root, 'img', null, null, ["src", "alt"], ["./assets/Icons/Basket.svg", "basket"]);

  }
}