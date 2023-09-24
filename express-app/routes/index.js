import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send({ endpoint: 'your at home' });
});

export default router;
