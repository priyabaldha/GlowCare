import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET
);

const COOKIE_NAME = "glowcare_session";

export async function createSession(userId) {
    const token = await new SignJWT({
        userId: userId.toString(),
    })
        .setProtectedHeader({
            alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set(
        COOKIE_NAME,
        token,
        {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        }
    );
}

export async function getSessionUserId() {
    try {
        const cookieStore = await cookies();

        const token =
            cookieStore.get(COOKIE_NAME)?.value;

        if (!token) {
            return null;
        }

        const { payload } = await jwtVerify(
            token,
            secret
        );

        return payload.userId || null;

    } catch (error) {
        console.error(
            "Session verification error:",
            error
        );

        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();

    cookieStore.delete(COOKIE_NAME);
}