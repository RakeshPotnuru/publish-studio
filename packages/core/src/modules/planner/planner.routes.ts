import { protectedProcedure, router } from "../../trpc";
import PlannerController from "./planner.controller";

const plannerRouter = router({});

export default plannerRouter;

// TODO: one time thing, remove after all users have planner
const adminPlannerRouter = router({
  initPlannerForExistingUsers: protectedProcedure.mutation(() =>
    new PlannerController().initPlannerForExistingUsers(),
  ),
});

export { adminPlannerRouter };
