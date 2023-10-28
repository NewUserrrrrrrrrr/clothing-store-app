import { Component } from "../Abstract/Component";



export class MainPage extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "main", ["main__page"]);
    const mainpage = new Component(this.root, 'div', ['mainpage__inner']);
    new Component(mainpage.root, 'img', ["mainpage__img"], null, ["src", "alt"], ["./assets/Photo.png", "main page photo"]);
    new Component(mainpage.root, 'p', [], "oodji - интернет-магазин женской одежды")
  }
}