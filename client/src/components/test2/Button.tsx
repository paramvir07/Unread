import { useAtom } from "jotai";
import { counterAtom, nameAtom } from "./Atoms";
import { useState } from "react";

const Button = () => {
  const [count] = useAtom(counterAtom);
  const [, setName] = useAtom(nameAtom);
  const [bname, setBname] = useState("Print name");
  return (
    <button
      onClick={() => {
        setName((name) => (name === "" ? "Param" : ""));
        setBname((bname) =>
          bname === "Print name" ? "Remove name" : "Print name"
        );
      }}
    >
      {bname} {count}
    </button>
  );
};

export default Button;
