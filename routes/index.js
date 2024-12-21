import userRoutes from "./userRoutes.js";
import aptitudeRoutes from "./aptitudeRoutes.js";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js";
import socialLinkRoutes from "./socialLinkRoutes.js";

const router = express.Router();

router.use("/", aptitudeRoutes);
router.use("/", userRoutes);
router.use("/", userAptitudeDetailsRoutes);
router.use("/", socialLinkRoutes);

export { userRoutes, aptitudeRoutes, userAptitudeDetailsRoutes };
