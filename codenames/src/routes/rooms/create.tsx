import { Show } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import RoomSetup from "~/components/RoomSetup";

export function routeData() {
  return createRouteData(async () => {
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
  });
}

export default function RoomCreate() {
  const user = useRouteData() as {
    user_id: string,
    nickname: string
  };
  const onClick = ({ nickname }: { nickname: string }) => {
    console.log({ nickname });
  };


  return <Show
    when={user}
    fallback={<div>loading ...</div>}
  >
    <RoomSetup nickname={user.nickname} onClick={onClick} />
  </Show>
}
