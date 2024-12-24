import { Router } from "express";
import {
  createSocialLink,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
  getSocialLinkById,
} from "../controllers/userSocialLinksController.js";

const router = Router();

router.post("/create-user-social-link", createSocialLink);
router.get("/get-user-social-links/:userId", getSocialLinksByUserId);
router.get("/get-social-link/:id", getSocialLinkById);
router.put("/update-user-social-links/:id", updateSocialLink);
router.delete("/delete-user-social-link/:id", deleteSocialLink);


export default router;
