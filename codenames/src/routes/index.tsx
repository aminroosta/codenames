import { redirect, useNavigate } from "solid-start";
import Intro from "~/components/Intro";

export default function Home() {
  const navigate = useNavigate();
  const onClick = () => navigate('/rooms/create');

  return (
    <main>
      <Intro onClick={onClick} />
    </main>
  );
}
// createEffect(async () => {
//   const { port } = await fetch('/api/ws').then(r => r.json());
//   const { hostname } = window.location;
//   const websocket = new WebSocket(`ws://${hostname}:${port}`);

//   websocket.onmessage = event => {
//     const messages = JSON.parse(event.data);
//     let message = messages[0];
//     switch (message.type) {
//       case "pong":
//         console.log("pong", message.data);
//     }
//   };

//   websocket.onclose = event => {
//     console.log(event);
//   };

//   let interval = setInterval(() => {
//     const id = crypto.randomUUID();

//     websocket.send(JSON.stringify({
//       type: "ping",
//       data: { id, lastPingMs: 0 }
//     }));
//   }, 1000);

//   onCleanup(() => {
//     clearInterval(interval);
//     websocket.close();
//   });
// });
