
import { Component } from './Abstract/Component';
import { Footer } from './Common/Footer';
import { Header } from './Common/Header';
import { Router } from './Common/Router';
import { Basket } from './Pages/Basket';
import { Catalog } from './Pages/Catalog';
import { Account } from './Pages/Account';
import { MainPage } from './Pages/MainPage';
import './style.scss';
import { Authorization } from './Pages/Authorization';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../configFB';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const body = document.body;

initializeApp(firebaseConfig);

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
    new Authorization(wrap.root);
  }
}

declare global {
  interface Window {
    app: App;
  }
}

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!window.app) window.app = new App(document.body);
})

