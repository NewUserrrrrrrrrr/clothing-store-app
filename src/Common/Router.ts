import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";
import { Detail } from "../Pages/Detail";

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
      this.links['#'].render();
    } else if (url === 'detail' && !(this.links["#detail"] as Detail).data) {
      this.links["#"].render();
    } else {
      this.links['#' + url].render();
    }
  }

}