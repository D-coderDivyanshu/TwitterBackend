import nodemailer from "nodemailer";

export async function sendOTP(recipient: string, emailToken: string) {
    // Crating email sending service
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASSWORD
        }
    });

    // Mail options 
    let mailOptions = {
        from: process.env.MY_EMAIL,
        to: recipient,
        subject: 'no-reply@Divyanshu : Your One Time Password',
        html: 
        `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .email-card {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
          }
          .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
            text-align: center;
          }
          .otp-code {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            padding: 10px;
            border: 1px dashed #007bff;
            display: inline-block;
          }
          .email-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
        </head>
        <body>
          <div class="email-card">
            <div class="email-header">
              Your One-Time Password (OTP)
            </div>
            <div class="email-body">
              <p>Please use the following OTP to proceed with your sign up:</p>
              <div class="otp-code">${emailToken}</div>
              <p>This OTP is valid for 10 minutes.</p>
            </div>
            <div class="email-footer">
              If you did not request this code, please ignore this email or contact support.
            </div>
          </div>
        </body>
        </html>
        `
    };

    try {
        const sendReport = await transporter.sendMail(mailOptions);
        console.log('Email sent:', sendReport.response);
    } catch (error) {
        console.error('Error occurred while sending email:', error);
    }
}