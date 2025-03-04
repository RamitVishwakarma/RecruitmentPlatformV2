export const generateEmailTemplate = (type, token) => {
  const baseUrl = process.env.FRONTEND_URL;

  const templates = {
    verification: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">GDG Recruitments: Verify Your Email</h2>
            <p style="color: #555;">Hi there,</p>
            <p style="color: #555;">Thank you for signing up! Please verify your email address to continue. This link will expire in 1h.</p>
            <a href="${baseUrl}/verify/${token}" 
               style="display: inline-block; margin: 20px 0; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 4px;">Verify Email</a>
            <p style="color: #555;">Or, copy your verification token below:</p>
            <button onclick="navigator.clipboard.writeText('${token}')" 
                    style="padding: 10px 20px; background-color: #4CAF50; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
              Copy Token
            </button>
          </div>
        </body>
      </html>
    `,
    passwordReset: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">GDG Recruitments: Reset Password</h2>
            <p style="color: #555;">Hi there,</p>
            <p style="color: #555;">It seems like you've requested a password reset. Click the link below to reset your password. This link will expire in 1h.</p>
            <a href="${baseUrl}/reset-password/${token}" 
               style="display: inline-block; margin: 20px 0; padding: 10px 20px; color: #fff; background-color: #FF5733; text-decoration: none; border-radius: 4px;">Reset Password</a>
            <p style="color: #555;">Or, copy your reset token below:</p>
            <button onclick="navigator.clipboard.writeText('${token}')" 
                    style="padding: 10px 20px; background-color: #FF5733; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
              Copy Token
            </button>
          </div>
        </body>
      </html>
    `,
  };

  return templates[type];
};
