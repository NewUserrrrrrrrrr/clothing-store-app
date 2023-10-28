import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Component } from "../Abstract/Component";



export class Authorization extends Component {
  regButton: Component;
  outButton: Component;
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["authorization"]);

    this.regButton = new Component(this.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Войти в аккаунт"]);
    this.regButton.root.onclick = () => {
      this.authWidthGoogle();
      console.log('lol');
    }

    this.outButton = new Component(this.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Выйти из аккаунта"]);
    this.outButton.root.onclick = () => {
      this.outFromGoogle();
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.toggleButton(true);
      // window.location.reload();
    } else {
      this.toggleButton(false);
    }

  }

  authWidthGoogle(): void {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        this.toggleButton(true);
        window.location.reload();
      })
      .catch(() => {
        console.log('bad');
      });
  }

  outFromGoogle(): void {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.toggleButton(false);
        window.location.reload();

      })
      .catch(() => {
        console.log('bad');
      });
  }

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