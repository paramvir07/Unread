import { useAtom } from "jotai";
import { counterAtom, doubleCounterAtom, nameAtom } from "./Atoms";
import Navbar from "./Navbar";
import User from "./User";
import { Separator } from "../ui/separator";
import ShoppingCart from "./ShoppingCart";

const JotaiTest = () => {
  const [count, setCount] = useAtom(counterAtom);
  const [name] = useAtom(nameAtom);
  const [dCount] = useAtom(doubleCounterAtom);

  return (
    <>
      <div>count: {count}</div>
      <div>Double count: {dCount}</div>
      <div>name: {name}</div>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button>
      {/* <button onClick={()=> }>Get Users</button> */}

      <Navbar />
      <User />
      <Separator />
      <ShoppingCart />
    </>
  );
};

export default JotaiTest;
