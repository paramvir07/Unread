import { useAtom } from "jotai";
import { cartItemsAtom, cartTotal } from "./Atoms";
import { Separator } from "../ui/separator";

const ShoppingCart = () => {
  const [items, setItems] = useAtom(cartItemsAtom);
  const [total] = useAtom(cartTotal);
  return (
    <>
      <div className="flex flex-col items-center gap-4 m-8">
        <div className="text-5xl">Shopping Cart</div>
        {items.map((item, i) => (
          <div key={i}>
            <div>Item: {item.item}</div>
            <div>Price: {item.price}$</div>
            <button
              className="bg-red-500 py-2 px-3 rounded-lg"
              onClick={() => setItems(items.filter((_, index) => index !== i))}
            >
              Delete
            </button>
            <Separator />
          </div>
        ))}
        <div className="text-4xl">
          Total: {total === 0 ? "0" : total.toFixed(2)}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-amber-400 py-2 px-3 rounded-lg"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {
                  item: "Apple",
                  price: 0.99,
                },
              ])
            }
          >
            Add Apple
          </button>
          <button
            className="bg-amber-600 py-2 px-3 rounded-lg"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {
                  item: "Banana",
                  price: 2.99,
                },
              ])
            }
          >
            Add Banana
          </button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
