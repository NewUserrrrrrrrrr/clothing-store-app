export class Component {
  root: HTMLElement;

  constructor(
    public parrent: HTMLElement,
    tegName: keyof HTMLElementTagNameMap,
    arrStyles?: string[] | null,
    content?: string | null,
    attrProp?: string[] | null,
    attrValue?: string[] | null
  ) {
    this.root = document.createElement(tegName);
    if (arrStyles) {
      arrStyles.forEach((nameStyle) => {
        this.root.classList.add(nameStyle);
      });
    }
    if (content) this.root.innerHTML = content;
    if (attrProp && attrValue && attrProp.length === attrValue.length) {
      attrProp.forEach((prop, i) => {
        this.root.setAttribute(prop, attrValue[i]);
      });
    }
    this.render();
  }
  render() {
    this.parrent.append(this.root);
  }
  remove() {
    this.root.remove();
  }
}