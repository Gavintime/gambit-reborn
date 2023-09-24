import { Router } from 'express';
let router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ endpoint: 'your at home' });
});

export default router;
