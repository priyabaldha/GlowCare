import crypto from "crypto";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import { sendPasswordResetEmail } from "../../../../lib/email";

export async function POST(request) {
    try {
        await connectDB();

        const { email } = await request.json();

        if (!email) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please enter your email address.",
                },
                { status: 400 }
            );
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        /*
         * Don't reveal whether an account
         * exists with this email.
         */
        if (!user) {
            return Response.json({
                success: true,
                message:
                    "If an account exists with this email, a password reset link has been sent.",
            });
        }

        // Generate a secure random token
        const resetToken =
            crypto.randomBytes(32).toString("hex");

        // Hash the token before storing it
        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

        // Token expires after 1 hour
        const resetTokenExpires =
            new Date(
                Date.now() + 60 * 60 * 1000
            );

        user.resetPasswordToken =
            hashedToken;

        user.resetPasswordExpires =
            resetTokenExpires;

        await user.save();

        // Create password reset URL
        const resetUrl =
            `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

        // Send reset email
        await sendPasswordResetEmail(
            user.email,
            resetUrl
        );

        return Response.json({
            success: true,
            message:
                "If an account exists with this email, a password reset link has been sent.",
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Something went wrong. Please try again.",
            },
            { status: 500 }
        );
    }
}