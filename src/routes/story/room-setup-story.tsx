import RoomSetup from "~/components/RoomSetup";

export default function RoomSetupStory() {
  return <RoomSetup
    nickname="amin"
    onClick={v => console.log(v)}
    buttonLabel="Create Room"
  />;
}
