
import { Component } from './Abstract/Component';
import { Footer } from './Common/Footer';
import { Header } from './Common/Header';
import { Router } from './Common/Router';
import { Basket } from './Pages/Basket';
import { Catalog } from './Pages/Catalog';
import { Account } from './Pages/Account';
import { MainPage } from './Pages/MainPage';
import './style.scss';


const body = document.body;



class App {
  constructor(parrent: HTMLElement) {
    const wrap = new Component(body, 'div', ["wrapper"]);
    new Header(wrap.root);
    const main = new Component(wrap.root, "main");

    const links = {
      "#": new MainPage(main.root),
      "#catalog": new Catalog(main.root),
      "#basket": new Basket(main.root),
      "#account": new Account(main.root)
    };

    new Router(links);
    new Footer(wrap.root);
  }
}

declare global {
  interface Window {
    app: App;
  }
}
window.app = new App(document.body);

