import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(request) {
    try {
        await connectDB();

        const {
            token,
            password,
        } = await request.json();

        // Check required fields
        if (!token || !password) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Reset token and password are required.",
                },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Password must be at least 6 characters.",
                },
                { status: 400 }
            );
        }

        // Hash the token from the URL
        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

        // Find user with matching token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {
                $gt: new Date(),
            },
        });

        // Token doesn't exist or has expired
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:
                        "This password reset link is invalid or has expired.",
                },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword =
            await bcrypt.hash(password, 12);

        // Update password
        user.password = hashedPassword;

        // Invalidate reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return Response.json({
            success: true,
            message:
                "Password reset successfully.",
        });

    } catch (error) {
        console.error(
            "Reset password error:",
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