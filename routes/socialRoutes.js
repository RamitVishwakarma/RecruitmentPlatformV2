import express from "express";
import {
  createSocialLink,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
} from "../controllers/socialLinkController.js";

const router = express.Router();

router.post("/:userId", createSocialLink);
router.get("/:userId", getSocialLinksByUserId);
router.put("/:id", updateSocialLink);
router.put("/:id/delete", deleteSocialLink);

export default router;
