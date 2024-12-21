import express from "express";
import {
  createSocialLink,
  getSocialLinks,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
} from "../controllers/socialLinkController.js";

const router = express.Router();

router.post("/social-links", createSocialLink);

router.get("/social-links", getSocialLinks);

router.get("/social-links/user/:userId", getSocialLinksByUserId);

router.put("/social-links/:id", updateSocialLink);

router.delete("/social-links/:id", deleteSocialLink);

export default router;
