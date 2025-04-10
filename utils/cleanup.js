export const cleanupExpiredTokens = async () => {
  const now = new Date();
  await prisma.VerificationToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
  console.log("verification token cleanup ran");
};
