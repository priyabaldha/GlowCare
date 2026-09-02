import nodemailer from "nodemailer";

const transporter =
    nodemailer.createTransport({
        service: "gmail",

        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

export async function sendPasswordResetEmail(
    email,
    resetUrl
) {
    await transporter.sendMail({
        from: `"GlowCare" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset your GlowCare password",

        text: `
Hello,

We received a request to reset your GlowCare password.

Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

GlowCare
        `,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                background: #FBF7F4;
                padding: 40px 20px;
            ">
                <div style="
                    max-width: 520px;
                    margin: 0 auto;
                    background: #FFF6F0;
                    padding: 40px;
                    border-radius: 20px;
                    border: 1px solid #E8DED8;
                ">
                    <p style="
                        color: #C98F89;
                        font-size: 11px;
                        letter-spacing: 3px;
                        font-weight: bold;
                    ">
                        GLOWCARE
                    </p>

                    <h1 style="
                        color: #5B3E3A;
                        font-family: Georgia, serif;
                        font-weight: normal;
                    ">
                        Reset your password
                    </h1>

                    <p style="
                        color: #6F625E;
                        line-height: 1.7;
                        font-size: 14px;
                    ">
                        We received a request to reset
                        your GlowCare account password.
                    </p>

                    <a
                        href="${resetUrl}"
                        style="
                            display: inline-block;
                            margin: 20px 0;
                            padding: 14px 24px;
                            background: #5B3E3A;
                            color: #FFF6F0;
                            text-decoration: none;
                            border-radius: 10px;
                            font-size: 13px;
                        "
                    >
                        Reset Password
                    </a>

                    <p style="
                        color: #6F625E;
                        line-height: 1.7;
                        font-size: 12px;
                    ">
                        This link will expire in 1 hour.
                    </p>

                    <p style="
                        color: #6F625E;
                        line-height: 1.7;
                        font-size: 12px;
                    ">
                        If you didn't request a password
                        reset, you can safely ignore this email.
                    </p>
                </div>
            </div>
        `,
    });
}