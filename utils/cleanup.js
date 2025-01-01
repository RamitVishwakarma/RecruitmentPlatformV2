export const cleanupExpiredTokens = async () => {
  const now = new Date();
  await prisma.verificationToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
};
