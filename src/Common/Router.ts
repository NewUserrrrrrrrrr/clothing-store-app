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

    this.links['#' + url].render();
  }
}