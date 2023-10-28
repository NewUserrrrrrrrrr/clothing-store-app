
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
import { LogicService } from './Services/LogicService';
import { AuthService } from './Services/AuthService';


const body = document.body;

initializeApp(firebaseConfig);

const services = {
  authService: new AuthService(),
  logicService: new LogicService()
};

class App {
  constructor(parrent: HTMLElement) {
    const wrap = new Component(body, 'div', ["wrapper"]);
    new Header(wrap.root, services);
    const main = new Component(wrap.root, "main");

    const links = {
      "#": new MainPage(main.root, services),
      "#catalog": new Catalog(main.root, services),
      "#basket": new Basket(main.root, services),
      "#account": new Account(main.root, services)
    };

    new Router(links, services);
    new Footer(wrap.root);
    new Authorization(wrap.root, services);
  }
}

declare global {
  interface Window {
    app: App;
  }
}

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  services.authService.user = user;
  if (!window.app) window.app = new App(document.body);
})

