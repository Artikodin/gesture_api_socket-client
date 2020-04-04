const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  document.addEventListener("mousemove", ({ clientX: x, clientY: y }) => {
    socket.send(JSON.stringify({ x, y }));
  });

  const square = document.getElementById("square");

  socket.onmessage = function (event) {
    let { x, y } = JSON.parse(event.data);
    square.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    console.log({ x, y });
  };
};
