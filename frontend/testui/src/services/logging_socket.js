
const ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
const socket = new WebSocket(`${ws_scheme}://127.0.0.1:8000/ws/sockets/`);

socket.onclose = function () {
    console.log("WebSockets connection closed");
};

export default socket;