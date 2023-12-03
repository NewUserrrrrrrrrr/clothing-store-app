import {Component} from "../Abstract/Component";


export class Footer extends Component {
    constructor(parrent: HTMLElement) {
        super(parrent, "footer", ["footer"]);
        const button = new Component(this.root, 'a', [], null, ["href"], ["#catalog"]);
        new Component(button.root, 'input', ["footer-btn"], null, ["type", "value"], ["button", "Каталог товаров"]);
        // const authobtn = new Component(this.root, 'a', [], null, ["href"], ["#authorization"]);
        // new Component(authobtn.root, 'input', ["footer-btn"], null, ["type", "value"], ["button", "Войти в аккаунт"]);
    }
}