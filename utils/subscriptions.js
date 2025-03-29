import prisma from "../utils/prisma.js";

const saveSubscription = async (userId, subscription) => {
  // const { userId, subscription } = req.body;
  await prisma.subscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      // endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    },
    create: {
      userId,
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
    },
  });
};

const getSubscription = async (userId) => {
  // const { userId } = req.body;
  if (!userId) throw new Error("userId is required");

  return prisma.subscription.findMany({ where: { userId } });
};

export { saveSubscription, getSubscription };
