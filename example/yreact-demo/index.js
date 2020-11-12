/** @jsx Yreact.createElement */
function Counter() {
  console.error('fun reload')
  const [state, setState] = Yreact.useState(1)
  const testFun = () => {
    setState(c => c + 1)
    console.log('****', state)
  }
  return (
    <h1 onClick={testFun}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />
const container = document.getElementById("root")
Yreact.render(element, container)