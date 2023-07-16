## Codenames

- It should work without signup

### Config

```ts
type config = {
  dbFile: string,
}
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
POST /clue/:clue_id/finish -- finish a clue
```

GET /room/status
- Give your operatives a clue
- Wait for your spymaster to give you a clue
- The opponent spymaster is playing, wait for your turn ...
- Your operatives are guessing now...
- Try to guess a word.
- The opponent operatives are playing, wait for your turn ...
```
Main page background:
radial-gradient(circle at 50% 50%, #e7663c 0%, #480C02 100%)
