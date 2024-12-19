import questionsRoutes from "../routes/questionsRoutes"
import optionsRoutes from "../routes/optionsRoutes"
import express from "express";

const router=express.Router();
router.use('/',questionsRoutes)
router.use('/',optionsRoutes)

export {questionsRoutes, optionsRoutes}