import { Router } from "express";
import mcqRouter from "./mcq.router";

const router = Router();

router.use("/contests/:contestId/mcq", mcqRouter);

export default router;
