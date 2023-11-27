import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { addDoc, collection, doc, Firestore, getDoc, getDocs, getFirestore, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Observer } from "../Abstract/Observer";
import { TCriteria, TDataBasket, TDataGraph, TDataHistory, TDataUser, TGood, TGoodBasket } from "../Abstract/Type";

export class DBService extends Observer {
  private db: Firestore = getFirestore(this.DBFirestore);

  dataUser: TDataUser | null = null;

  dataBasket: TDataBasket = {
    summa: 0,
    percent: 0,
    allSumma: 0,
    count: 0,
    skirt: 0,
    jacket: 0,
    trousers: 0
  }

  constructor(private DBFirestore: FirebaseApp) {
    super();
  }

  calcCostGood(count: number, price: number): number {
    const cost = count * price
    return cost;
  }

  calcDataBasket() {
    if (!this.dataUser) return;
    let summa = 0;
    let count = 0;
    let skirt = 0;
    let jacket = 0;
    let trousers = 0;
    this.dataUser.basket.forEach(el => {//берем каждый элемент корзины
      summa += el.count * el.good.price;//находим сумму товара перемножив количество на цену
      count += el.count;
      if (el.good.category === "платья") { //
        skirt += el.count;
      } else if (el.good.category === "куртки") {
        jacket += el.count;
      } else {
        trousers += el.count;
      }
    });
    const percent = summa >= 200 ? 7 : summa >= 100 ? 3 : 0;
    const allSumma = summa - summa * percent / 100;

    this.dataBasket.allSumma = allSumma;
    this.dataBasket.count = count;
    this.dataBasket.summa = summa;
    this.dataBasket.percent = percent;

    this.dataBasket.jacket = jacket;
    this.dataBasket.skirt = skirt;
    this.dataBasket.trousers = trousers;
  }

  async getAllGoods(criteria: TCriteria): Promise<TGood[]> {
    const crit = [];
    if (criteria.category != 'all') crit.push(where('category', '==', criteria.category));
    if (criteria.price == 'up') {
      crit.push(orderBy('price', "asc"));
    } else {
      crit.push(orderBy("price", 'desc'));
    }
    const q = query(collection(this.db, 'clothing'), ...crit);
    const querySnapshot = await getDocs(q);
    const storage = getStorage();
    const goods = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const uri = ref(storage, data.url);
      const url = await getDownloadURL(uri);
      const good = {
        name: data.name as string,
        price: data.price as number,
        category: data.category as string,
        detail: data.detail as string,
        url: url,
        id: doc.id
      };
      return good;
    });
    return Promise.all(goods);
  }

  async getDataUser(user: User | null): Promise<void> {
    if (user === null) return;

    const docRef = doc(this.db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.dataUser = docSnap.data() as TDataUser;
    } else {
      const data = {
        email: user.email,
        name: user.displayName,
        fotoUrl: user.photoURL,
        basket: []
      };
      await setDoc(doc(this.db, "users", user.uid), data);
      const docSetSnap = await getDoc(docRef);
      this.dataUser = docSetSnap.data() as TDataUser || null;
      console.log("create documemt");
    }
  }

  async addGoodInBasket(user: User | null, good: TGood): Promise<void> {
    if (!user || !this.dataUser) return;

    const index = this.dataUser.basket.findIndex(el => el.good.id === good.id);
    if (index >= 0) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);

    const goodBasket = {
      good: good,
      count: 1
    } as TGoodBasket;

    newUser.basket.push(goodBasket);

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket();
        this.dispatch('goodInBasket', goodBasket);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => { });
  }

  async changeGoodInBasket(user: User | null, goodBasket: TGoodBasket): Promise<void> {
    if (!user || !this.dataUser) return;

    const index = this.dataUser.basket.findIndex((el) => el.good.id === goodBasket.good.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket[index] = goodBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket();
        this.dispatch("changeDataBasket", this.dataBasket);
      })
      .catch(() => { });
  }

  async delGoodFromBasket(user: User | null, good: TGoodBasket): Promise<void> {
    if (!user || !this.dataUser) return;

    const newBasket = this.dataUser.basket.filter((el) => el.good.id !== good.good.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket = newBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket();
        this.dispatch('delGoodFromBasket', good.good.id);
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      })
  }

  async addBasketInHistory(user: User | null): Promise<void> {
    if (!user || !this.dataUser) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser)
    newUser.basket = [];

    const dataHistory = {
      basket: this.dataUser.basket,
      dataBasket: this.dataBasket,
      data: Timestamp.now()
    };

    await addDoc(collection(this.db, 'users', user.uid, 'history'), dataHistory)
      .then(async () => {
        await setDoc(doc(this.db, 'users', user.uid), newUser)
          .then(() => {
            if (!this.dataUser) throw "БД отсутствует";
            this.dataUser.basket.forEach((el) => {
              this.dispatch('delBookFromBasket', el.good.id);
            })
            this.dispatch('addInHistory', dataHistory)
            this.dataUser = newUser;
            this.calcDataBasket();
            this.dispatch('clearBasket');
            this.dispatch('changeDataBasket', this.dataBasket);
            this.calcCountDocsHistory(user);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  async calcCountDocsHistory(user: User | null): Promise<void> {
    if (!user || !this.dataUser) return;

    const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"));
    const count = querySnapshot.docs.length;
    let summa = 0;
    let skirt = 0;
    let jacket = 0;
    let trousers = 0;
    querySnapshot.docs.forEach(el => {
      summa += el.data().dataBasket.allSumma;
      skirt += el.data().dataBasket.skirt;
      jacket += el.data().dataBasket.jacket;
      trousers += el.data().dataBasket.trousers;
    })
    this.dispatch('changeStat', count, summa);
    this.dispatch('changeStatAdmin', skirt, jacket, trousers);
  }
  async calcCountStatForAdmin(user: User | null): Promise<void> {
    if (!user || !this.dataUser) return;

    const querySnapshot = await getDocs(collection(this.db, "users"));
    const count = querySnapshot.docs.length;
    let summa = 0;
    let skirt = 0;
    let jacket = 0;
    let trousers = 0;
    // querySnapshot.docs.forEach(el=>{//берем всех пользователей
    //   el.data().forEach(il=>{//у каждого пользователя ищем коллекцию
    //     const querySnapshot2=await getDocs(collection(thi))
    //   })
    // })
    // querySnapshot.docs.forEach(el => {
    //   summa += el.data().dataBasket.allSumma;
    //   skirt += el.data().dataBasket.skirt;
    //   jacket += el.data().dataBasket.jacket;
    //   trousers += el.data().dataBasket.trousers;
    // })
    // this.dispatch('changeStat', count, summa);
    this.dispatch('changeStatAdmin', skirt, jacket, trousers);
  }


  async getAllHistory(user: User | null): Promise<TDataHistory[]> {
    if (!user || !this.dataUser) return [];
    const querySnapshot = await getDocs(collection(this.db, 'users', user.uid, 'history'));
    const rez = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TDataHistory;
      data.id = doc.id;
      return data;
    })
    return rez;
  }

  updateDataGraph(histories: TDataHistory[]): TDataGraph[] {
    const data = {} as Record<string, number>;
    histories.forEach((el) => {
      const dataString = el.data.toDate().toDateString();
      if (data[dataString]) {
        data[dataString] += el.dataBasket.allSumma;
      } else {
        data[dataString] = el.dataBasket.allSumma;
      }
    });
    const sortData = [];
    for (const day in data) {
      sortData.push({
        x: new Date(day),
        y: data[day]
      });
    }
    return sortData.sort(
      (a, b) => a.x.getMilliseconds() - b.x.getMilliseconds()
    );
  }

  openDetailPage(good: TGood): void {
    this.dispatch('updateDetailPage', good);
    window.location.hash = "#detail";
  }

}