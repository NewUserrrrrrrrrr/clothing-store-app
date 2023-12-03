import {Component} from "../Abstract/Component";
import {TGoodBasket, TServices} from "../Abstract/Type";

export class CardBasket extends Component {
    btnDel: Component;
    spanCount: Component;
    spanCost: Component;

    constructor(parrent: HTMLElement, private services: TServices, private data: TGoodBasket) {
        super(parrent, 'div', ["cardbasket"]);

        new Component(this.root, 'img', ["cardbasket__img"], null, ["src", "alt"], [data.good.url, data.good.name])
        const textCard = new Component(this.root, 'div', ["cardbasket__textcard"]);
        new Component(textCard.root, 'span', [], data.good.name);
        const countCard = new Component(textCard.root, 'div', ["cardbasket__countcard"]);
        new Component(countCard.root, 'span', [], "Количество: ");
        const btnDec = new Component(countCard.root, 'input', ["cardbasket__btn"], null, ["value", "type"], ["-", "button"]);
        btnDec.root.onclick = () => {
            this.changeCountBook(-1);
        }
        this.spanCount = new Component(countCard.root, 'span', [], `${data.count}`);
        const btnInk = new Component(countCard.root, 'input', ["cardbasket__btn"], null, ["value", "type"], ["+", "button"]);
        btnInk.root.onclick = () => {
            this.changeCountBook(1);
        }
        const costCard = new Component(textCard.root, 'div', ["cardbasket__costcard"]);
        new Component(costCard.root, 'span', [], "Стоимость: ");
        this.spanCost = new Component(costCard.root, 'span', [], `${services.dbService.calcCostGood(data.count, data.good.price)} руб`);
        // const textCard=new Component(this.root,'div',["cardbasket__textcard"])
        this.btnDel = new Component(this.root, 'input', ["cartbasket__del"], null, ["value", "type"], ["", "button"]);
        this.btnDel.root.onclick = () => {
            this.delGoodFromBasket();
        }
    }

    changeCountBook(grad: number) {
        const newCount = this.data.count + grad;
        if (newCount <= 0) return;

        const newData = {} as TGoodBasket;
        Object.assign(newData, this.data);
        newData.count = newCount;

        const user = this.services.authService.user;
        this.services.dbService.changeGoodInBasket(user, newData).then(() => {
            Object.assign(this.data, newData);
            this.spanCount.root.innerHTML = `${this.data.count}`;
            this.spanCost.root.innerHTML = `${this.services.dbService.calcCostGood(this.data.count, this.data.good.price)} руб`
        });
    }

    delGoodFromBasket() {
        const user = this.services.authService.user;
        this.services.dbService.delGoodFromBasket(user, this.data)
            .then(() => {
                this.remove();
            })
            .catch(() => {
            });
    }
}