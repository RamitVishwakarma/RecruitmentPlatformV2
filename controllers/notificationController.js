import webPush from "web-push";
import { saveSubscription, getSubscription } from "../utils/subscriptions.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const VAPID_KEYS = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails(
  `mailto:${process.env.ADMIN_EMAIL_ID}`,
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey,
);

const subscribeUser = asyncHandler(async (req, res) => {
  const { userId, subscription } = req.body;
  saveSubscription(userId, subscription);
  res
    .status(statusCode.Ok200)
    .json({ message: "Subscription saved successfully!" });
});

const sendNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, url } = req.body;

  const notif = await prisma.notification.create({
    data: { userId, title, message },
  });

  if (!notif) {
    return res
      .status(statusCode.Conflict409)
      .json({ error: "Notification creation unsuccessful" });
  }

  const subscriptions = await getSubscription(userId);

  if (!subscriptions) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Subscriptions not found" });
  }

  const payload = JSON.stringify({ title, message, url });
  await subscriptions.forEach((sub) => {
    webPush.sendNotification(sub, payload);
  });
  // await webPush.sendNotification(subscription, payload);

  return res.status(statusCode.Ok200).json({ message: "Notification sent" });
});

const getNotificationByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return res.status(statusCode.Ok200).json(notifications);
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return res.json({ success: true });
});

export {
  subscribeUser,
  sendNotification,
  getNotificationByUserId,
  markNotificationAsRead,
};
