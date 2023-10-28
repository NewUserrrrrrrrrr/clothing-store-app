import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Component } from "../Abstract/Component";

export class Router {
  constructor(public links: Record<string, Component>) {
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
      if (wind) { this.authWidthGoogle() } else { this.links['#'].render(); }

    } else {
      this.links['#' + url].render();
    }
  }
  authWidthGoogle(): void {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        console.log('bad');
      });
  }
}