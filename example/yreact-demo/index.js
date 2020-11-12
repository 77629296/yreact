/** @jsx Yreact.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>
}
const element = <App name="foo" />
console.log(element)
const container = document.getElementById("root")
Yreact.render(element, container)