/** @jsx Yreact.createElement */
function Counter() {
  const [state, setState] = Yreact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />
const container = document.getElementById("root")
Yreact.render(element, container)