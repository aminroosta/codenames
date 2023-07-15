import express from 'express';

const router = express.Router();

router.get('/', ({ orm, session }, res) => {
  const user_id = session.id;
  const [user = null] = orm.query({ from: 'users', where: { user_id } });

  res.json(user);
});

router.post('/', ({ orm, session, body }, res) => {
  const user_id = session.id;
  let [user = null] = orm.query({ from: 'users', where: { user_id } });
  if (!user) {
    user = orm.insert({
      into: 'users',
      data: { user_id, nickname: body.nickname }
    });
  }
  else {
    user = orm.update({
      table: 'users',
      where: { user_id },
      set: { nickname: body.nickname }
    })[0];
  }

  res.json(user);
});

export default router;
