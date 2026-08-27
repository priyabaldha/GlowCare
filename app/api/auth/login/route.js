import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import { createSession } from "../../../../lib/auth";

export async function POST(request) {
    try {
        await connectDB();

        const {
            email,
            password,
        } = await request.json();

        // Check required fields
        if (!email || !password) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Please enter your email and password.",
                },
                {
                    status: 400,
                }
            );
        }

        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        // User doesn't exist
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Invalid email or password.",
                },
                {
                    status: 401,
                }
            );
        }

        // Compare entered password
        // with hashed password in MongoDB
        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatches) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Invalid email or password.",
                },
                {
                    status: 401,
                }
            );
        }

        // Create session
        await createSession(user._id);

        // Decide where the user should go
        const redirect =
            user.role === "admin"
                ? "/admin"
                : "/";

        return Response.json({
            success: true,
            message: "Login successful.",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },

            redirect,
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return Response.json(
            {
                success: false,
                message:
                    "Something went wrong while logging in.",
            },
            {
                status: 500,
            }
        );
    }
}