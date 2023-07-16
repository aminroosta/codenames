## Codenames

- It should work without signup

### Config

```ts
type config = {
  card_images: number[];
}
```

### Database Design
```sql
create table users (
  user_id uuid primary key,
  nickname text not null
);

create table rooms (
  room_id uuid primary key,
  name text not null,
  owner_id uuid not null references users(user_id),
  cards jsonb not null, -- [{image: 'card-0.jpg', color: 'red'}, ...]
  status text not null, -- lobby, playing, finished
);

create unique index room_name_idx on rooms(name);

create table room_users (
  room_id uuid not null references rooms(room_id),
  user_id uuid not null references users(user_id),
  team text not null, -- red, blue
  role text not null -- spymaster, player
);

create index room_users_room_id_user_id_idx on room_users(room_id, user_id);

create table room_clues (
  room_id uuid not null references rooms(room_id),
  user_id uuid not null references users(user_id),
  word text not null,
  count int not null,
  status text not null, -- active, finished
  votes jsonb not null, -- [['Jon', ...],...]
  created_at timestamp not null default now()
);

create index room_clues_room_id_created_at_idx on room_clues(room_id, created_at);
create unique index room_clues_room_id_status_idx on room_clues(room_id) where status = 'active';

create table shown (
  clue_id uuid not null references room_clues(clue_id),
  user_id uuid not null references users(user_id),
  card_idx int not null,
  created_at timestamp not null default now()
);


```
### API

```
GET /api/user -- get user info
POST /api/user -d "{nickname: string}" -- create or update user with nickname

POST /room -- create a new room
GET /room/name -- get room info
type room_info = {
  name: string,
  owner: string,
  status: string,
  cards: {image: string, color: string, face: string}[],
  users: {nickname: string, team: string, role: string}[],
  clues: {clue: string, count: number, votes: string[], revealed: number[]}[]
}
POST /room/:room_id/start -- start game
POST /room/:room_id/restart -- restart game
POST /room/:room_id:join -d {team: 'red', role: 'player'} -- join a team

GET /room/:room_id/clue -- get room clues
POST /room/:room_id/clue -d {clue: string, count: number} -- create a clue

POST /clue/:clue_id/vote - d { card_idx: number, vote: boolean } -- vote for a card
POST /clue/:clue_id/show - d { card_idx: number } -- show a card

GET /room/:room_id/shown -- get all shown cards
GET /clue/:clue_id/shown -- get shown cards for a clue
```

GET /room/status
- Give your operatives a clue
- Wait for your spymaster to give you a clue
- The opponent spymaster is playing, wait for your turn ...
- Your operatives are guessing now...
- Try to guess a word.
- The opponent operatives are playing, wait for your turn ...
```
