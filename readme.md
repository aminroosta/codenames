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
  cards jsonb not null, -- [{image: 'card-0.jpg', color: 'red', shown: false}, ...]
  votes jsonb not null, -- {red: [['Jon', ...],...], blue: [['Jon', ...]]}
  status text not null, -- waiting, playing, finished
);

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
  clue text not null,
  count int not null,
  created_at timestamp not null default now()
);

create index room_clues_room_id_created_at_idx on room_clues(room_id, created_at);

-- chat messages
create table room_messages (
  room_id uuid not null references rooms(room_id),
  user_id uuid not null references users(user_id),
  message text not null,
  created_at timestamp not null default now(),
  primary key (room_id, user_id, created_at)
);
```

