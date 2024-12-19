import userRoutes from "./userRoutes.js"
import aptitudeRoutes from "./aptitudeRoutes.js"
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js"
const router=express.Router();
router.use('/',aptitudeRoutes)
router.use('/',userRoutes)
router.use('/',userAptitudeDetailsRoutes)
export {userRoutes,aptitudeRoutes,userAptitudeDetailsRoutes}