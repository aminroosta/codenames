import { Accessor, Show } from "solid-js";
import { createRouteData, useNavigate, useRouteData } from "solid-start";
import RoomSetup from "~/components/RoomSetup";

export function routeData() {
  return createRouteData(async () => {
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
  });
}

export default function RoomCreate() {
  const user = useRouteData() as any;
  const navigate = useNavigate();
  const onClick = async ({ nickname }: { nickname: string }) => {
    const room = await fetch(
      '/api/room', {
      method: 'POST',
      body: JSON.stringify({ nickname })
    }).then(r => r.json());
    navigate(`/rooms/${room.name}`);
  };


  return <Show
    when={user()}
    fallback={<div>loading ...</div>}
  >
    <RoomSetup nickname={user().nickname} onClick={onClick} />
  </Show>
}
