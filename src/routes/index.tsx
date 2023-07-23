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
