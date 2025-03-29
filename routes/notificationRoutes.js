import { Router } from "express";
import {
  subscribeUser,
  sendNotification,
  getNotificationByUserId,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
const router = Router();

/**
 * @swagger
 * /notifications/get/{userId}:
 *   get:
 *     summary: Retrieve notifications for a specific user
 *     tags: [Notifications]
 *     description: Get all notifications for a user, ordered by creation date.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose notifications are to be retrieved.
 *     responses:
 *       200:
 *         description: A list of notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No notifications found.
 */
router.route("/get/:userId").get(getNotificationByUserId);

/**
 * @swagger
 * /notifications/subscribe:
 *   post:
 *     summary: Subscribe a user for push notifications
 *     tags: [Notifications]
 *     description: Stores a user's push notification subscription in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user subscribing.
 *               subscription:
 *                 type: object
 *                 description: The push subscription object.
 *     responses:
 *       200:
 *         description: Subscription saved successfully.
 *       400:
 *         description: Invalid request.
 */
router.route("/subscribe").post(subscribeUser);

/**
 * @swagger
 * /notifications/send-notification:
 *   post:
 *     summary: Send a push notification to a user
 *     tags: [Notifications]
 *     description: Sends a notification and stores it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The recipient user's ID.
 *               title:
 *                 type: string
 *                 description: Title of the notification.
 *               message:
 *                 type: string
 *                 description: Notification message content.
 *               url:
 *                 type: string
 *                 description: (Optional) URL the notification should link to.
 *     responses:
 *       200:
 *         description: Notification sent successfully.
 *       404:
 *         description: Subscription not found.
 */
router.route("/send-notification").post(sendNotification);

/**
 * @swagger
 * /notifications/mark-read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     description: Updates the notification's isRead field to true.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: The ID of the notification to be marked as read.
 *     responses:
 *       200:
 *         description: Notification marked as read.
 */
router.route("/mark-read").put(markNotificationAsRead);

export default router;
