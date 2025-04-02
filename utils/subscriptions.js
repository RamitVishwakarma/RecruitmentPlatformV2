import prisma from "../utils/prisma.js";

const saveSubscription = async (userId, subscription) => {
  if (!subscription) {
    console.error(" Subscription object is missing!");
  }
  if (!subscription.endpoint) {
    console.error(" Subscription endpoint is missing!", subscription);
  }
  const sub = await prisma.subscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
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
  return sub;
};

const getSubscription = async (userId) => {
  if (!userId) throw new Error("userId is required");

  return prisma.subscription.findMany({ where: { userId } });
};

export { saveSubscription, getSubscription };
