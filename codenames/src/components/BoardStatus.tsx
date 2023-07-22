import { Role, RoomStatus } from "~/common/types";
import "./BoardStatus.css";

export default function BoardTitle(p: {
  status: RoomStatus;
  role: Role;
}) {

  const title = () => {
    if (
      (p.status == 'red-operator' && p.role == 'red-operator') ||
      (p.status == 'blue-operator' && p.role == 'blue-operator')
    ) {
      return 'Try to guess a word.';
    }

    if (
      (p.status == 'red-spymaster' && p.role == 'red-spymaster') ||
      (p.status == 'blue-spymaster' && p.role == 'blue-spymaster')
    ) {
      return 'Give your operatives a clue.';
    }

    if (
      (p.status == 'red-spymaster' && p.role == 'red-operator') ||
      (p.status == 'blue-spymaster' && p.role == 'blue-operator')
    ) {

      return 'Wait for your spymaster to give you a clue...';
    }

    if (
      (p.status == 'red-operator' && p.role == 'red-spymaster') ||
      (p.status == 'blue-operator' && p.role == 'blue-spymaster')
    ) {
      return 'Your operatives are guessing now...';
    }

    if (
      (p.status == 'red-operator' && p.role.startsWith('blue-')) ||
      (p.status == 'blue-operator' && p.role.startsWith('red-'))
    ) {
      return 'The opponent operative is playing, wait for your turn...';
    }

    if (
      (p.status == 'red-spymaster' && p.role.startsWith('blue-')) ||
      (p.status == 'blue-spymaster' && p.role.startsWith('red-'))
    ) {
      return 'The opponent spymaster is playing, wait for your turn...';
    }

    if (p.role == 'none') {
      let [color, role] = p.status.split('-');
      color = color[0].toUpperCase() + color.slice(1);
      role = role == 'operator' ? "operatives are" : "spymaster is";
      return `${color} ${role} playing. (To play, you need to join a team.)`;
    }

    return p.status;
  };

  return <div class='board-status'> {title()} </div>
}
