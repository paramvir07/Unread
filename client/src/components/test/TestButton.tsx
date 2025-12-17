import { useContext } from "react"
import TestSpan from "./TestSpan"
import { counterContext } from "./Context"


const TestButton = () => {
    const counter = useContext(counterContext)
    if(!counter) return <div></div>
  return (
    <>
    <button onClick={()=>counter.setCount(count=>count+1)} className="bg-yellow-100 text-black"><TestSpan />Test Button</button>
    </>
  )
}

export default TestButton