import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Component } from "../Abstract/Component";
import { TServices } from "../Abstract/Type";



export class Authorization extends Component {
  regButton: Component;
  outButton: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["authorization"]);

    this.regButton = new Component(this.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Войти в аккаунт"]);
    this.regButton.root.onclick = () => {
      this.services.authService.authWidthGoogle();
      console.log('lol');
    }

    this.outButton = new Component(this.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Выйти из аккаунта"]);
    this.outButton.root.onclick = () => {
      this.services.authService.outFromGoogle();
    }

    const user = this.services.authService.user;
    if (user) {
      this.toggleButton(true);
      // window.location.reload();
    } else {
      this.toggleButton(false);
    }
    this.services.authService.addListener('userAuth', (isAuthUser) => {
      if (isAuthUser) {
        this.toggleButton(true)
      } else {
        this.toggleButton(false)
      }
    })
  }

  // authWidthGoogle(): void {
  //   const auth = getAuth();
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider)
  //     .then(() => {
  //       this.toggleButton(true);
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       console.log('bad');
  //     });
  // }


  // outFromGoogle(): void {
  //   const auth = getAuth();
  //   signOut(auth)
  //     .then(() => {
  //       this.toggleButton(false);
  //       window.location.reload();

  //     })
  //     .catch(() => {
  //       console.log('bad');
  //     });
  // }

  toggleButton(isAuthUser: boolean): void {
    if (isAuthUser) {
      this.regButton.remove();
      this.outButton.render();
    } else {
      this.regButton.render();
      this.outButton.remove();
    }
  }
}