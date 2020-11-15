/** @jsx Yreact.createElement */
function Counter() {
  const [content, setConcent] = Yreact.useState('')
  const onInput = (e) => {
    let value = e.target.value
    setConcent(value)
  }
  return (
    <div>
      <input onInput={onInput} />
      <span>content: {content}</span>
    </div>
  )
}
const element = <Counter />
const container = document.getElementById('root')
Yreact.render(element, container)
