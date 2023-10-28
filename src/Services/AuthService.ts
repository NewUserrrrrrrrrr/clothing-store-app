import { signInWithPopup, signOut, User, GoogleAuthProvider, getAuth } from "firebase/auth";
import { Observer } from "../Abstract/Observer";

export class AuthService extends Observer {
  user: User | null = null;


  authWidthGoogle(): void {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        this.dispatch('userAuth', true);
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
        this.dispatch('userAuth', false);
        window.location.reload();

      })
      .catch(() => {
        console.log('bad');
      });
  }
}