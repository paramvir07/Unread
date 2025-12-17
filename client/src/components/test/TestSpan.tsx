import { useContext } from "react";
import { counterContext } from "./Context";

const TestSpan = () => {
    const counter = useContext(counterContext)
    if(!counter) return <div></div>
  return (
    <>
      <div>{counter.count}</div>
    </>
  );
};

export default TestSpan;
