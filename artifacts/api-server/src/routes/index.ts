import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vehiclesRouter from "./vehicles";
import reservationsRouter from "./reservations";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vehiclesRouter);
router.use(reservationsRouter);
router.use(statsRouter);

export default router;
