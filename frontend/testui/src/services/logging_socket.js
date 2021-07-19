
const ws_scheme = window.location.protocol == 'https:' ? 'wss' : 'ws'
const socket = new WebSocket(`${ws_scheme}://192.168.4.1:8000/ws/sockets/`)
// const socket = new WebSocket(`${ws_scheme}://192.168.0.107:8000/ws/sockets/`)

socket.onclose = function () {
  console.log('WebSockets connection closed')
}

export default socket
