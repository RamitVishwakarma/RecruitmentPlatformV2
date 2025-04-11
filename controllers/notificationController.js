import webPush from "web-push";
import { saveSubscription, getSubscription } from "../utils/subscriptions.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";
import prisma from "../utils/prisma.js";

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

  const subObj = await saveSubscription(userId, subscription);

  return res
    .status(statusCode.Ok200)
    .json({ message: "Subscription saved successfully!" });
});

// const sendNotification = asyncHandler(async (req, res) => {
//   const { userId, title, message, url } = req.body;

//   const notif = await prisma.notification.create({
//     data: { userId, title, message, url },
//   });

//   if (!notif) {
//     return res
//       .status(statusCode.Conflict409)
//       .json({ error: "Notification creation unsuccessful" });
//   }

//   const subscriptions = await getSubscription(userId);

//   if (!subscriptions || subscriptions.length === 0) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ error: "Subscriptions not found" });
//   }

//   const payload = JSON.stringify({ title, message, url });

//   for (const sub of subscriptions) {
//     if (!sub.auth || !sub.p256dh) {
//       console.error("Subscription is missing auth/p256dh:", sub);
//       continue;
//     }

//     const pushSubscription = {
//       endpoint: sub.endpoint,
//       keys: {
//         auth: sub.auth,
//         p256dh: sub.p256dh,
//       },
//     };

//     try {
//       await webPush.sendNotification(pushSubscription, payload);
//     } catch (error) {
//       console.error("Error sending push notification:", error);

//       if (error.statusCode === 410) {
//         console.error("Deleting expired subscription:", sub.endpoint);
//         await prisma.subscription.delete({
//           where: { endpoint: sub.endpoint },
//         });
//       }
//     }
//   }

//   console.log("Notifications successfully sent to all valid subscriptions");
//   return res.status(statusCode.Ok200).json({ message: "Notification sent" });
// });

const sendNotification = asyncHandler(async (req, res) => {
  const { title, message, url } = req.body;

  if (!title || !message) {
    return res.status(statusCode.BadRequest400).json({
      error: "Title and message are required",
    });
  }

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const targetUserIds = allUsers.map((user) => user.id);

  const payload = JSON.stringify({ title, message, url });

  await Promise.all(
    targetUserIds.map(async (userId) => {
      try {
        await prisma.notification.create({
          data: { userId, title, message, url },
        });

        const subscriptions = await getSubscription(userId);

        if (!subscriptions || subscriptions.length === 0) return;

        for (const sub of subscriptions) {
          if (!sub.auth || !sub.p256dh) continue;

          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh,
            },
          };

          try {
            await webPush.sendNotification(pushSubscription, payload);
          } catch (error) {
            console.error("Push error:", error);

            if (error.statusCode === 410) {
              await prisma.subscription.delete({
                where: { endpoint: sub.endpoint },
              });
            }
          }
        }
      } catch (err) {
        console.error(`Notification failed for user ${userId}:`, err);
      }
    }),
  );

  return res.status(statusCode.Ok200).json({
    message: `Notification sent to ${targetUserIds.length} user(s)`,
  });
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

// const getAllSubscriptions = asyncHandler(async (req, res) => {
//   const subscriptions = await prisma.subscription.findMany({
//     select: {
//       id: true,
//       userId: true,
//       endpoint: true,
//       auth: true,
//       p256dh: true,
//     },
//   });
//   if (!subscriptions.length) {
//     return res.status(404).json({ error: "No subscriptions found" });
//   }
//   return res.status(200).json(subscriptions);
// });

export {
  subscribeUser,
  sendNotification,
  getNotificationByUserId,
  markNotificationAsRead,
};
