import express from 'express';
import { v4 } from 'uuid';
import bip39 from 'bip39';

const router = express.Router();

router.post('/room', ({ orm, user_id }, res) => {
  const room = orm.insert({
    into: 'rooms',
    data: {
      user_id: user_id,
      room_id: v4(),
      name: bip39.generateMnemonic().split(' ').slice(0, 3).join('-'),
    }
  });

  res.json(room);
});

router.get('/:name', ({ orm, params }, res) => {
  const { name } = params;
  const [room = null] = orm.query({ from: 'rooms', where: { name } });

  res.json(room);
});

export default router;
