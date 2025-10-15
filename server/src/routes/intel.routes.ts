import { Router } from 'express';
import { intelController } from '../controllers/intel.controller';

const router = Router();
// GET /api/intel?ip=<ip>
router.get('/intel', intelController);

export default router;
