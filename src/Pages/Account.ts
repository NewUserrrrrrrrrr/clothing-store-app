import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";
import { Graph } from "../Common/Graph";



export class Account extends Component {
  skirt: Component;
  jacket: Component;
  trousers: Component;
  divUser: Component;
  divAdmin: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["account"]);

    const admin = services.logicService.emailAdmin;

    let isBasketClear = false;
    if (services.dbService.dataUser) {
      if (services.dbService.dataUser.email === admin) isBasketClear = true;
    }


    this.divUser = new Component(this.root, 'div', []);
    new Component(this.divUser.root, 'h1', ["account__title"], "Личный аккаунт");

    const accUser = new Component(this.divUser.root, 'div', ["account__user"]);
    new Component(accUser.root, 'span', ["accoun__username"], services.authService.user?.displayName);
    const emailUser = new Component(accUser.root, 'div', ["account__user-email"]);
    new Component(emailUser.root, 'span', [], "Электронная почта:");
    new Component(emailUser.root, 'span', ["account-email"], services.dbService.dataUser?.email);

    const divStat = new Component(accUser.root, 'div', ["stat__data"]);
    new Component(divStat.root, 'span', ["stat__name"], "История заказов");


    const divGraph = new Component(accUser.root, "div", ["stat__graph"]);
    const graph = new Graph(divGraph.root);

    const user = services.authService.user;
    services.dbService.getAllHistory(user).then((historys) => {
      graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
      graph.graphik.update();
      // this.putHistoryOnPage(this.divHistory, historys);
    });
    services.dbService.addListener('addInHistory', () => {
      const user = services.authService.user;
      services.dbService.getAllHistory(user).then((historys) => {
        graph.graphik.data.datasets[0].data = services.dbService.updateDataGraph(historys);
        graph.graphik.update();
      });
      // this.putHistoryOnPage(this.divHistory, [history as TDataHistoryWithId]);
    });

    this.divAdmin = new Component(this.root, 'div', []);
    this.toggleBasket(isBasketClear);
    new Component(this.divAdmin.root, 'h1', ["account__title"], "Администратор");
    const divAdminStat = new Component(this.divAdmin.root, 'div', ["account__admin-stat"]);
    new Component(divAdminStat.root, 'span', [], "Статистика продаж")
    this.skirt = new Component(divAdminStat.root, 'span', [], `Платья: ${0}`)
    this.jacket = new Component(divAdminStat.root, 'span', [], `Куртки: ${0}`)
    this.trousers = new Component(divAdminStat.root, 'span', [], `Брюки: ${0}`)

    services.dbService.addListener('changeStatAdmin', (skirt, jacket, trousers) => {
      this.skirt.root.innerHTML = `Платья: ${skirt}`;
      this.jacket.root.innerHTML = `Куртки: ${jacket}`;
      this.trousers.root.innerHTML = `Брюки: ${trousers}`;
    })

  }
  toggleBasket(isBasketClear: boolean) {
    if (isBasketClear) {
      this.divAdmin.render();
      this.divUser.remove();
    } else {
      this.divAdmin.remove();
      this.divUser.render();
    }
  }
}