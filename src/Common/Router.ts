import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";

export class Router {
  constructor(public links: Record<string, Component>, private services: TServices) {
    this.openPage();

    window.onhashchange = () => {
      this.openPage();
    }
  }

  openPage() {
    Object.values(this.links).forEach((el) => el.remove());

    const url = window.location.hash.slice(1);

    const auth = getAuth();
    const user = auth.currentUser;

    if ((url === 'account' || url === 'basket') && !user) {
      const wind = window.confirm("Для доступа на эту страницу нужно зарегистрироваться\nВойти в аккаунт?");
      if (wind) { this.services.authService.authWidthGoogle() } else { this.links['#'].render(); }

    } else {
      this.links['#' + url].render();
    }
  }

}