import { Router } from 'express';

const router = Router();

router.get('/', (req, res, next) => {
  res.send({ endpoint: 'your at home' });
});

export default router;
