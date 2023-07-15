import express from 'express';


const router = express.Router();

router.get('/api/session', (req, res) => {
  const session_id = req.session.id;
  res.send(session_id);
});
