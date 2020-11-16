// const App = React.createElement('div', null, 'Hello')
// const App = React.createElement(
//   'div',
//   null,
//   React.createElement('h1', null, 'Hello')
// )
const App = React.createElement(
  'div',
  null,
  React.createElement('h1', null, React.createElement('span', null, 'Hello'))
)
// {
//   type: 'xxx',
//   props: {
//     chlidren: []
//   }
// }

console.log(App)
const container = document.getElementById('root')
ReactDOM.render(App, container)
