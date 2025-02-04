import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../utils/prisma.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.phonenumbers.read",
      ],
      prompt: "select_account",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const { data } = await axios.get(
          "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const phoneNumber = data.phoneNumbers
          ? data.phoneNumbers[0].value
          : null;

        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
          select: { id: true, name: true, email: true, photo: true },
        });
        if (user) {
          await prisma.user.update({
            where: { googleId: profile.id },
            data: { photo: profile.photos[0]?.value },
          });
        } else {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              photo: profile.photos[0]?.value || null,
              phone: phoneNumber,
              password: hashedPassword,
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, photo: true },
    });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default passport;
