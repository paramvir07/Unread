import axios from "axios";
import { atom } from "jotai";
import { loadable } from "jotai/utils";

type Items = {
  item: string;
  price: number;
};

export const counterAtom = atom(0);
export const nameAtom = atom("");
export const doubleCounterAtom = atom((get) => get(counterAtom) * 2);

const asyncGetUser = atom(async () => {
  const response = await axios.get("http://localhost:3000/api/getUsers");
  return response.data;
});

export const loadableUserAtom = loadable(asyncGetUser);

// Shopping cart

export const cartItemsAtom = atom<Items[]>([]);
export const cartTotal = atom((get) => get(cartItemsAtom).reduce((total, item)=> total+item.price, 0)) ;
