import express from 'express';

const router = express.Router();

router.get('/', ({orm, session}, res) => {
  const user_id = session.id;
  console.log(user_id);
  const user = orm.query({from: 'users', where: {user_id}});
  res.send(user);
});


export default router;
