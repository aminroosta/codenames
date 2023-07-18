PRAGMA foreign_keys = ON;

create table users (
  user_id uuid primary key not null,
  nickname text not null
);

create table rooms (
  room_id uuid primary key not null,
  user_id uuid not null references users(user_id), -- user who created the room
  name text not null, -- 3 words separated by hyphens
  cards jsonb not null, -- [{image: 'card-0.jpg', color: 'red'}, ...]
  status text not null -- waiting, playing, finished
);

create unique index room_name_idx on rooms(name);

create table room_users (
  room_id uuid not null references rooms(room_id),
  user_id uuid not null references users(user_id),
  team text not null, -- red, blue
  role text not null -- spymaster, player
);

create index room_users_room_id_user_id_idx on room_users(room_id, user_id);

create table clues (
  clue_id uuid primary key not null,
  room_id uuid not null references rooms(room_id),
  user_id uuid not null references users(user_id),
  word text not null,
  count int not null,
  status text not null, -- active, finished
  created_at timestamp not null default current_timestamp
);

create index clues_room_id_created_at_idx on clues(room_id, created_at);
create unique index clues_room_id_status_idx on clues(room_id) where status = 'active';

create table shown_cards (
  clue_id uuid not null references clues(clue_id),
  user_id uuid not null references users(user_id),
  card_idx int not null,
  created_at timestamp not null default current_timestamp
);

create table votes (
  clue_id uuid not null references clues(clue_id),
  user_id uuid not null references users(user_id),
  card_idx int not null
);