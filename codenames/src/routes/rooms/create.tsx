import { createResource, Show } from "solid-js";
import { useNavigate } from "solid-start";
import RoomSetup from "~/components/RoomSetup";

export default function RoomCreate() {
  const [user] = createResource(
    () => fetch("/api/user").then(r => r.json())
  );
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
    <RoomSetup
      nickname={user().nickname}
      onClick={onClick}
      buttonLabel="Create Room"
    />
  </Show>
}
