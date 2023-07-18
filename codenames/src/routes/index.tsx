import { createEffect, onCleanup } from "solid-js";
import { Title } from "solid-start";
import Counter from "~/components/Counter";
import { createWebSocketServer } from "solid-start/websocket";
import server$ from "solid-start/server";

export default function Home() {
  createEffect(async () => {
    const { port } = await fetch('/api/ws').then(r => r.json());
    const { hostname } = window.location;
    const websocket = new WebSocket(`ws://${hostname}:${port}`);

    websocket.onmessage = event => {
      const messages = JSON.parse(event.data);
      let message = messages[0];
      switch (message.type) {
        case "pong":
          console.log("pong", message.data);
      }
    };

    websocket.onclose = event => {
      console.log(event);
    };

    let interval = setInterval(() => {
      const id = crypto.randomUUID();

      websocket.send(JSON.stringify({
        type: "ping",
        data: { id, lastPingMs: 0 }
      }));
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
      websocket.close();
    });
  });

  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
    </main>
  );
}
