import TestNav from "./TestNav";
import { counterContext } from "./Context";
import { useState } from "react";

export const TestMain = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <counterContext.Provider value={{count, setCount}}>
        <div>test main</div>
        <button onClick={() => setCount((count) => count + 1)}>Main Button</button>
        <div>count: {count}</div>
        <TestNav />
      </counterContext.Provider>
    </>
  );
};
