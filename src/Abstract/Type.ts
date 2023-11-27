import { Timestamp } from "firebase/firestore";
import { AuthService } from "../Services/AuthService";
import { DBService } from "../Services/DBService";
import { LogicService } from "../Services/LogicService";


export type TServices = {
  authService: AuthService,
  logicService: LogicService,
  dbService: DBService
}

export type TGood = {
  name: string,
  price: number,
  category: string,
  detail: string,
  url: string,
  id: string
}

export type TGoodBasket = {
  good: TGood,
  count: number
}

export type TDataUser = {
  name: string,
  fotoUrl: string,
  email: string,
  basket: TGoodBasket[]
}

export type TCriteria = {
  price: string,
  category: string
}

export type TDataBasket = {
  summa: number,
  percent: number,
  allSumma: number,
  count: number,
  skirt: number,
  jacket: number,
  trousers: number
}


export type TDataHistory = {
  basket: TGoodBasket[],
  dataBasket: TDataBasket,
  data: Timestamp,
  id: string
}

export type TDataGraph = {
  x: Date,
  y: number,
}
