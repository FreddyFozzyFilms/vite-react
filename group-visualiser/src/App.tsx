import { useState } from 'react'
import './App.css'

import Expr from './group-logic/Expr'
import DragButton from './DragButton'

interface GroupProps {
  expr: Expr;
}
function Group(props: GroupProps) {
  const {expr} = props;

  return (
    <div>
      {expr.toArr().map((s : String, index) => <button key={index}>{s}</button>)}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  const expr = Expr.add(Expr.add(Expr.val('a'), Expr.val('b')), Expr.val('c'))

  return (
    <>
      <Group expr={expr}/>
      <DragButton />
    </>
  )
}

export default App
