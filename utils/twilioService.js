import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = twilio(accountSid, authToken);

export const sendOTP = async (phone) => {
  try {
    client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" })
      .then((verification) => console.log(verification.sid));
  } catch (error) {
    console.error("Twilio error:", error);
    throw new Error("Failed to send OTP");
  }
};
