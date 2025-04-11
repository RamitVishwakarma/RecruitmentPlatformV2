export const generateEmailTemplate = (type, token) => {
  const baseUrl = process.env.FRONTEND_URL;

  const templates = {
    verification: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color:rgb(210, 222, 232);
      font-family: "Product Sans", Arial, sans-serif;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      text-align: center;
      padding: 40px 0;
      background-color: #ffffff;
    }

    .header img {
      width: 75px;
      height: 36px;
    }

    .content {
      padding: 0 40px;
    }

    .greeting, .message, .help-text {
      color: #272727;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      letter-spacing: 0.28px;
    }

    .greeting {
      font-size: 16px;
      line-height: 28px;
      font-weight: 500;
    }

    .otp-box {
      display: inline-block;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .otp-code {
      color: #272727;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .notice {
      color: #272727;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      padding-bottom: 24px;
      letter-spacing: 0.28px;
    }

    .help-button {
      display: inline-block;
      border: 1px solid #e0e0e0;
      border-radius: 22px;
      padding: 8px 12px;
      text-decoration: none;
      color: #272727;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .help-button:hover {
      color: #1E40AF;
      border-color: #1E40AF;
      cursor: pointer;
      text-decoration: none;
    }

    .help-button img {
      vertical-align: middle;
      margin-right: 8px;
    }

    @media only screen and (max-width: 600px) {
      table[class="container"] {
        width: 90% ;
        margin: 0 auto ;
      }

      .content {
        padding: 0 20px ;
      }

      .header {
        padding: 24px 20px ;
      }

      .help-button {
        margin-bottom: 16px ;
      }

      .footer-icons td {
        padding: 0 4px ;
      }
    }
  </style>
</head>
<body>
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="width: 100%; max-width: 600px;">
          
         
          <tr>
            <td class="header">
              <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Google Developer Groups Logo" />
              <h1 style="margin: 16px 0 0; color: #272727; font-size: 19px; font-weight: 500;">Google Developer Groups OnCampus</h1>
              <p style="margin: 8px 0 0; color: #585858; font-size: 13px; font-weight: 400;">JSS Academy Of Technical Education</p>
            </td>
          </tr>

          
          <tr>
            <td class="content">
              <p class="greeting">Hi there,</p>
              <p class="message">Thank you for choosing us!<br />Your One-Time Password (OTP) to proceed with your registration is:</p>

              <div class="otp-container">
                <div class="otp-box">
                  <span class="otp-code">${token}</span>
                </div>
              </div>

              <p class="notice">This OTP is valid for the next 10 minutes. Please do not share it with anyone for security reasons.<br />If you did not request this, you can safely ignore this email.</p>

              <p class="help-text">Feel free to reach out if you have any questions. We're here to help!</p>

              <a href="https://chat.whatsapp.com/KIzWKEujQqbHgOWKAtYhWj" class="help-button">
                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/help.png" alt="Help Icon" width="18" height="18" /> Need help?
              </a>
            </td>
          </tr>

          
          <tr>
            <td style="padding: 40px 0 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F7FF; border-top: 4px solid #DDE3FF;">
                <tr>
                  <td style="padding: 40px;">
                   
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td width="36">
                          <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Logo" width="36" height="36" style="display: block;" />
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: 500; color: #374151;">Google Developer Groups OnCampus</p>
                          <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #585858;">JSS Academy of Technical Education</p>
                        </td>
                      </tr>
                    </table>

                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #6B7280; font-family: Arial, sans-serif; font-size: 14px;">
                          © 2025 GDG JSSATEN
                        </td>
                        <td align="right">
                          <table border="0" cellpadding="0" cellspacing="0" class="footer-icons">
                            <tr>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.linkedin.com/company/dsc-jssaten/" target="_blank" style="text-decoration: none;">
                                    <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/linkedin.png" alt="LinkedIn" width="24" height="24" style="display: block;" />
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://www.instagram.com/gdgoncampus.jss?igsh=MnJudjI3aGMxN2hp" target="_blank" style="text-decoration: none;">
                                    <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/insta.png" alt="Instagram" width="24" height="24" style="display: block;" />
                                  </a>
                                </td>
                                <td style="padding: 0 8px;">
                                  <a href="https://x.com/GDSCJSSATEN?t=gZio_ve6LIQSw6HunOiqdg&s=09" target="_blank" style="text-decoration: none;">
                                    <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/x.png" alt="twitter" width="24" height="24" style="display: block;" />
                                  </a>
                                </td>
                              </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    passwordReset: `
      <!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: rgb(210, 222, 232); padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333;">GDG Recruitments: Reset Password</h2>
      <p style="color: #555;">Hi there,</p>
      <p style="color: #555;">It seems like you've requested a password reset.Click on the button below to reset your password.The button's link will be expired in an hour.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f1f1f1; color: #333; border: 1px dashed #ccc; border-radius: 6px; font-size: 16px; text-align: center;">
       <a href=${`${process.env.FRONTEND_URL}/reset-password/${token}`} style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px;">
  Reset Password
</a>
      </div>
      <p style="color: #555;">If you face any further issues contact the team through the whatsapp channel.</p>
    </div>
  </body>
</html>
    `,
    registration: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Registration Confirmation</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: rgb(210, 222, 232);
      font-family: Arial, sans-serif;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      text-align: center;
      padding: 40px 20px;
      background-color: #ffffff;
    }
    .header img {
      width: 75px;
    }
    .help-text {
      color: #272727;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      letter-spacing: 0.28px;
    }
    .help-button {
      display: inline-block;
      border: 1px solid #e0e0e0;
      border-radius: 22px;
      padding: 8px 12px;
      text-decoration: none;
      color: #272727;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .help-button img {
      vertical-align: middle;
      margin-right: 8px;
    }
    a.full-btn {
      display: block;
      width: 100%;
      text-align: center;
      font-size: 16px;
      padding: 12px 0;
      text-decoration: none;
      border-radius: 8px;
    }
    a.btn-primary {
      background-color: #6366F1;
      color: #ffffff;
    }
    a.btn-secondary {
      border: 1px solid #6366F1;
      color: #6366F1;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 90% !important;
        margin: 0 auto !important;
      }
      .header, .content, .footer {
        padding: 24px 20px !important;
      }
      .full-btn {
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f7f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb;">
          
          <tr>
            <td class="header">
              <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Logo" />
              <h1 style="margin: 16px 0 0; color: #272727; font-size: 19px; font-weight: 500;">Google Developer Groups OnCampus</h1>
              <p style="margin: 8px 0 0; color: #585858; font-size: 13px; font-weight: 400;">JSS Academy Of Technical Education</p>
            </td>
          </tr>

          
          <tr>
            <td class="content" style="padding: 0 40px;">
              <p style="font-size: 16px; color: #333333;">Hi ${token}</p>
              <p style="font-size: 14px; color: #333333; line-height: 24px;">Welcome to Recruitments'25 GDG JSSATEN! 🎉<br>Your registration is now successfully completed.</p>
              <p style="font-size: 16px; font-weight: 500; color: #333333;">✅ Make sure to keep an eye on your inbox and check your Dashboard regularly for the latest info.</p>
              <p style="font-size: 14px; color: #333333; line-height: 24px;">Completing your profile helps recruiters get to know you better and boosts your chances of landing the right opportunity.</p>
              <p class="help-text">Feel free to reach out if you have any questions. We're here to help!</p>
              <a href="https://chat.whatsapp.com/KIzWKEujQqbHgOWKAtYhWj" class="help-button">
                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/help.png" alt="Help Icon" width="18" height="18" /> Need help?
              </a>

              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td width="49%" align="center" style="padding: 10px;">
                    <a href="https://recruitments.gdscjss.in" class="full-btn btn-secondary">View Timeline</a>
                  </td>
                  <td width="49%" align="center" style="padding: 10px;">
                    <a href="https://recruitments.gdscjss.in/dashboard" class="full-btn btn-primary">Visit Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

           <tr>
                        <td style="padding: 40px 0 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F7FF; border-top: 4px solid #DDE3FF;">
                                <tr>
                                    <td style="padding: 40px;">
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                            <tr>
                                                <td width="36">
                                                    <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Logo" width="36" height="36" style="display: block;" />
                                                </td>
                                                <td style="padding-left: 16px;">
                                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: 500; color: #374151;">Google Developer Groups OnCampus</p>
                                                    <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #585858;">JSS Academy of Technical Education</p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #6B7280; font-family: Arial, sans-serif; font-size: 14px;">
                                                    © 2025 GDG JSSATEN
                                                </td>
                                                <td align="right">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding: 0 8px;">
                                                              <a href="https://www.linkedin.com/company/dsc-jssaten/" target="_blank" style="text-decoration: none;">
                                                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/linkedin.png" alt="LinkedIn" width="24" height="24" style="display: block;" />
                                                              </a>
                                                            </td>
                                                            <td style="padding: 0 8px;">
                                                              <a href="https://www.instagram.com/gdgoncampus.jss?igsh=MnJudjI3aGMxN2hp" target="_blank" style="text-decoration: none;">
                                                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/insta.png" alt="Instagram" width="24" height="24" style="display: block;" />
                                                              </a>
                                                            </td>
                                                            <td style="padding: 0 8px;">
                                                              <a href="https://x.com/GDSCJSSATEN?t=gZio_ve6LIQSw6HunOiqdg&s=09" target="_blank" style="text-decoration: none;">
                                                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/x.png" alt="twitter" width="24" height="24" style="display: block;" />
                                                              </a>
                                                            </td>
                                                          </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    task: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>task</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            background-color: rgb(210, 222, 232);
            font-family: "Product Sans", Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background-color: #ffffff;
        }
        .header img {
            width: 75px;
        }
        .content {
            padding: 0 40px;
        }
        .greeting, .message, .help-text {
      color: #272727;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      letter-spacing: 0.28px;
    }

    .greeting {
      font-size: 16px;
      line-height: 28px;
      font-weight: 500;
    }
        .help-button {
            display: inline-block;
            border: 1px solid #e0e0e0;
            border-radius: 22px;
            padding: 8px 12px;
            text-decoration: none;
            color: #272727;
            
            font-size: 14px;
            margin-bottom: 24px;
        }

       .help-button:hover {
    
           color: #1E40AF;           
           border-color: #1E40AF;
           cursor: pointer;
           text-decoration: none;
        }
        .help-button img {
            vertical-align: middle;
            margin-right: 8px;
        }
         a.full-btn {
      display: block;
      width: 100%;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 16px;
      padding: 12px 0;
      text-decoration: none;
      border-radius: 8px;
    }

    a.btn-primary {
      background-color: #6366F1;
      color: #ffffff;
    }

    a.btn-primary:hover {
      background-color: #4f46e5;
    }


    a.btn-secondary {
      border: 1px solid #6366F1;
      color: #6366F1;
    }

    a.btn-secondary:hover {
      background-color: #e0e7ff;
    }
    @media only screen and (max-width: 600px) {
      table[width="600"] {
        width: 90% ;
        margin: 0 auto ;
      }

      .content {
        padding: 0 20px ;
      }

      .header {
        padding: 24px 20px ;
      }

      .full-btn {
        font-size: 15px ;
      }

      .help-button {
        margin-bottom: 16px ;
      }
    }
</style>
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f7f7;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                     <tr>
                        <td class="header">
                            <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Google Developer Groups Logo" />
                            <h1 style="margin: 16px 0 0; color: #272727; font-size: 19px; font-weight: 500;">Google Developer Groups OnCampus</h1>
                            <p style="margin: 8px 0 0; color: #585858; font-size: 13px; font-weight: 400;">JSS Academy Of Technical Education</p>
                        </td>
                    </tr>
                   
                   <tr>
                        <td class="content">
                            <p class="greeting">Hi ${token},</p>
                            
                            <p class="message">🎉 Congratulations! You've have been shortlisted for the Task round round.</p>
                            <p class="greeting">📝 Task Submission Deadline: [Insert Deadline Date & Time]<br>💻 Visit your dashboard to view the task details and submit your work.</p>
                            
  </td>
                    </tr>
                    
                   <tr>
  <td class="content">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        
        <td width="49%" align="center" style="padding-right: 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="https://recruitment-platform-v2-frontend.vercel.app/"
                   target="_blank"
                   class="full-btn btn-secondary">
                  View Timeline
                </a>
              </td>
            </tr>
          </table>
        </td>

       
        <td width="49%" align="center" style="padding-left: 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <a href="https://recruitment-platform-v2-frontend.vercel.app/dashboard"
                   target="_blank"
                   class="full-btn btn-primary">
                  Visit Dashboard
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

                    <tr>
                        <td class="content">
                            
                            
                            <p class="help-text">Feel free to reach out if you have any questions. We're here to help!</p>
                            
                            <a href="https://chat.whatsapp.com/KIzWKEujQqbHgOWKAtYhWj" class="help-button">
                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/help.png" alt="Help Icon" width="18" height="18" /> Need help?
                            </a>
                        </td>
                    </tr>
                    
                    
                    
                    <tr>
                        <td style="padding: 40px 0 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F7FF; border-top: 4px solid #DDE3FF;">
                                <tr>
                                    <td style="padding: 40px;">
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                                            <tr>
                                                <td width="36">
                                                    <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Logo" width="36" height="36" style="display: block;" />
                                                </td>
                                                <td style="padding-left: 16px;">
                                                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: 500; color: #374151;">Google Developer Groups OnCampus</p>
                                                    <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #585858;">JSS Academy of Technical Education</p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="color: #6B7280; font-family: Arial, sans-serif; font-size: 14px;">
                                                    © 2025 GDG JSSATEN
                                                </td>
                                                <td align="right">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding: 0 8px;">
                                                              <a href="https://www.linkedin.com/company/dsc-jssaten/" target="_blank" style="text-decoration: none;">
                                                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/linkedin.png" alt="LinkedIn" width="24" height="24" style="display: block;" />
                                                              </a>
                                                            </td>
                                                            <td style="padding: 0 8px;">
                                                              <a href="https://www.instagram.com/gdgoncampus.jss?igsh=MnJudjI3aGMxN2hp" target="_blank" style="text-decoration: none;">
                                                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/insta.png" alt="Instagram" width="24" height="24" style="display: block;" />
                                                              </a>
                                                            </td>
                                                            <td style="padding: 0 8px;">
                                                              <a href="https://x.com/GDSCJSSATEN?t=gZio_ve6LIQSw6HunOiqdg&s=09" target="_blank" style="text-decoration: none;">
                                                                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/x.png" alt="twitter" width="24" height="24" style="display: block;" />
                                                              </a>
                                                            </td>
                                                          </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
    notification: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Notification</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: rgb(210, 222, 232);
      font-family: "Product Sans", Arial, sans-serif;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      text-align: center;
      padding: 40px 0;
      background-color: #ffffff;
    }

    .header img {
      width: 75px;
    }

    .content {
      padding: 0 40px;
    }

    .greeting,
    .message,
    .help-text {
      color: #272727;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      letter-spacing: 0.28px;
    }

    .greeting {
      font-size: 16px;
      line-height: 28px;
      font-weight: 500;
    }

    .help-button {
      display: inline-block;
      border: 1px solid #e0e0e0;
      border-radius: 22px;
      padding: 8px 12px;
      text-decoration: none;
      color: #272727;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .help-button img {
      vertical-align: middle;
      margin-right: 8px;
    }

    a.full-btn {
      display: block;
      width: 100%;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 16px;
      padding: 12px 0;
      text-decoration: none;
      border-radius: 8px;
    }

    a.btn-primary {
      background-color: #6366f1;
      color: #ffffff;
    }

    a.btn-primary:hover {
      background-color: #4f46e5;
    }

    a.btn-secondary {
      border: 1px solid #6366f1;
      color: #6366f1;
    }

    a.btn-secondary:hover {
      background-color: #e0e7ff;
    }

    @media only screen and (max-width: 600px) {
      .container {
        width: 90% !important;
        margin: 0 auto !important;
      }

      .content {
        padding: 0 20px !important;
      }

      .header {
        padding: 24px 20px !important;
      }

      .full-btn {
        font-size: 15px !important;
      }

      .help-button {
        margin-bottom: 16px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f7f7;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td class="header">
              <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Google Developer Groups Logo" />
              <h1 style="margin: 16px 0 0; color: #272727; font-size: 19px; font-weight: 500;">Google Developer Groups OnCampus</h1>
              <p style="margin: 8px 0 0; color: #585858; font-size: 13px; font-weight: 400;">JSS Academy Of Technical Education</p>
            </td>
          </tr>

          <tr>
            <td class="content">
              <p class="greeting">Hi ${token},</p>
              <p class="message">We have an important update for you regarding the recruitment process:</p>
              <p class="notice">🔔 [Notification Text Placeholder]</p>
              <p class="message">Please make sure to check your Dashboard for more details and stay informed about upcoming steps.</p>
            </td>
          </tr>

          <tr>
            <td class="content">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="49%" align="center" style="padding-right: 10px;">
                    <a href="https://recruitment-platform-v2-frontend.vercel.app/" target="_blank" class="full-btn btn-secondary">View Timeline</a>
                  </td>
                  <td width="49%" align="center" style="padding-left: 10px;">
                    <a href="https://recruitment-platform-v2-frontend.vercel.app/dashboard" target="_blank" class="full-btn btn-primary">Visit Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="content">
              <p class="help-text">Feel free to reach out if you have any questions. We're here to help!</p>
              <a href="https://chat.whatsapp.com/KIzWKEujQqbHgOWKAtYhWj" class="help-button">
                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/help.png " alt="Help Icon" width="18" height="18" /> Need help?
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 0 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f7ff; border-top: 4px solid #dde3ff;">
                <tr>
                  <td style="padding: 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td width="36">
                          <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Logo" width="36" height="36" style="display: block;" />
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-size: 18px; font-weight: 500; color: #374151;">Google Developer Groups OnCampus</p>
                          <p style="margin: 4px 0 0; font-size: 14px; color: #585858;">JSS Academy of Technical Education</p>
                        </td>
                      </tr>
                    </table>

                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">© 2025 GDG JSSATEN</td>
                        <td align="right">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 0 8px;">
                                <a href="https://www.linkedin.com/company/dsc-jssaten/" target="_blank">
                                  <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/linkedin.png" alt="LinkedIn" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding: 0 8px;">
                                <a href="https://www.instagram.com/gdgoncampus.jss?igsh=MnJudjI3aGMxN2hp" target="_blank">
                                  <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/insta.png" alt="Instagram" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding: 0 8px;">
                                <a href="https://x.com/GDSCJSSATEN?t=gZio_ve6LIQSw6HunOiqdg&s=09" target="_blank">
                                  <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/x.png" alt="Twitter" width="24" height="24" />
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    interview: `    
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Interview</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: rgb(210, 222, 232);
      font-family: "Product Sans", Arial, sans-serif;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      text-align: center;
      padding: 40px 0;
      background-color: #ffffff;
    }

    .header img {
      width: 75px;
    }

    .content {
      padding: 0 40px;
    }

    .greeting, .message, .help-text {
      color: #272727;
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      letter-spacing: 0.28px;
    }

    .greeting {
      font-size: 16px;
      line-height: 28px;
      font-weight: 500;
    }

    .help-button {
      display: inline-block;
      border: 1px solid #e0e0e0;
      border-radius: 22px;
      padding: 8px 12px;
      text-decoration: none;
      color: #272727;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .help-button:hover {
      color: #1E40AF;
      border-color: #1E40AF;
      cursor: pointer;
      text-decoration: none;
    }

    .help-button img {
      vertical-align: middle;
      margin-right: 8px;
    }

    a.full-btn {
      display: block;
      width: 100%;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 16px;
      padding: 12px 0;
      text-decoration: none;
      border-radius: 8px;
    }

    a.btn-primary {
      background-color: #6366F1;
      color: #ffffff;
    }

    a.btn-primary:hover {
      background-color: #4f46e5;
    }

    a.btn-secondary {
      border: 1px solid #6366F1;
      color: #6366F1;
    }

    a.btn-secondary:hover {
      background-color: #e0e7ff;
    }

    
    @media only screen and (max-width: 600px) {
      table[width="600"] {
        width: 90% ;
        margin: 0 auto ;
      }

      .content {
        padding: 0 20px ;
      }

      .header {
        padding: 24px 20px ;
      }

      .full-btn {
        font-size: 15px ;
      }

      .help-button {
        margin-bottom: 16px ;
      }
    }
  </style>
</head>
<body>
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f7f7;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td class="header">
              <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Google Developer Groups Logo" />
              <h1 style="margin: 16px 0 0; color: #272727; font-size: 19px; font-weight: 500;">Google Developer Groups OnCampus</h1>
              <p style="margin: 8px 0 0; color: #585858; font-size: 13px; font-weight: 400;">JSS Academy Of Technical Education</p>
            </td>
          </tr>
          <tr>
            <td class="content">
              <p class="greeting">Hi ${token},</p>
              <p class="message">🎉 Congratulations! You've have been shortlisted for the interview round.</p>
              <p class="greeting">
                🕒 Interview Date & Time: [Insert Date & Time]<br>
                📍 Location: [Insert Full Address / Venue Details]
              </p>
              <p class="message">Please make sure to arrive 10–15 minutes early and carry your laptop with project that you have submitted.</p>
              <p class="message">We're excited to meet you in person — best of luck!</p>
            </td>
          </tr>
          <tr>
            <td class="content">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="49%" align="center" style="padding-right: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="https://recruitments.gdscjss.in/" target="_blank" class="full-btn btn-secondary">View Timeline</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="49%" align="center" style="padding-left: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="https://recruitments.gdscjss.in/dashboard" target="_blank" class="full-btn btn-primary">Visit Dashboard</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="content">
              <p class="help-text">Feel free to reach out if you have any questions. We're here to help!</p>
              <a href="https://chat.whatsapp.com/KIzWKEujQqbHgOWKAtYhWj" class="help-button">
                <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/help.png " alt="Help Icon" width="18" height="18" /> Need help?
              </a>
            </td>
          </tr>
         
          <tr>
            <td style="padding: 40px 0 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F7FF; border-top: 4px solid #DDE3FF;">
                <tr>
                  <td style="padding: 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td width="36">
                          <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/logo.png" alt="Logo" width="36" height="36" style="display: block;" />
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: 500; color: #374151;">Google Developer Groups OnCampus</p>
                          <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #585858;">JSS Academy of Technical Education</p>
                        </td>
                      </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #6B7280; font-family: Arial, sans-serif; font-size: 14px;">
                          © 2025 GDG JSSATEN
                        </td>
                        <td align="right">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 0 8px;">
                                <a href="https://www.linkedin.com/company/dsc-jssaten/" target="_blank" style="text-decoration: none;">
                                  <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/linkedin.png" alt="LinkedIn" width="24" height="24" style="display: block;" />
                                </a>
                              </td>
                              <td style="padding: 0 8px;">
                                <a href="https://www.instagram.com/gdgoncampus.jss?igsh=MnJudjI3aGMxN2hp" target="_blank" style="text-decoration: none;">
                                  <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/insta.png" alt="Instagram" width="24" height="24" style="display: block;" />
                                </a>
                              </td>
                              <td style="padding: 0 8px;">
                                <a href="https://x.com/GDSCJSSATEN?t=gZio_ve6LIQSw6HunOiqdg&s=09" target="_blank" style="text-decoration: none;">
                                  <img src="https://recruitmentplatformgdgjss.s3.ap-south-1.amazonaws.com/email-templates/x.png" alt="twitter" width="24" height="24" style="display: block;" />
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  return templates[type];
};
