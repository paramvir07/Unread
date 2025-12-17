import { createContext} from "react";
type CounterContext = {
    count: number
    setCount: React.Dispatch<React.SetStateAction<number>>
}

export const counterContext = createContext<CounterContext | null>(null);