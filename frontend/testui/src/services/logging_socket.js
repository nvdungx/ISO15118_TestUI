const ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
const socket = new WebSocket(`${ws_scheme}://127.0.0.1:8000/ws/sockets/`);

socket.onopen = function open() {
    console.log('WebSockets connection created.');
};
if (socket.readyState == WebSocket.OPEN) {
    socket.onopen();
    console.log("socket open")
}
else {
    console.log("hmmm")
}

socket.onmessage = function receive_msg(params) {
    console.log(params)
}
export default socket;