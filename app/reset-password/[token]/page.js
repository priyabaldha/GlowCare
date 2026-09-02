"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();

    const token = params?.token;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        if (!token) {
            setError(
                "Invalid password reset link."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/auth/reset-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message ||
                        "Unable to reset password."
                );
                return;
            }

            setSuccess(
                "Your password has been reset successfully."
            );

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            setError(
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">

            <section className="auth-card">

                <div className="auth-heading">

                    <p className="section-eyebrow">
                        GLOWCARE ACCOUNT
                    </p>

                    <h1>
                        Create a
                        <span>new password.</span>
                    </h1>

                    <p>
                        Choose a new password for
                        your GlowCare account.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label>
                            NEW PASSWORD
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="At least 6 characters"
                            required
                            minLength={6}
                        />

                    </div>

                    <div className="auth-field">

                        <label>
                            CONFIRM PASSWORD
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password again"
                            required
                            minLength={6}
                        />

                    </div>

                    {error && (
                        <p className="auth-message error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="auth-message success">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}

                        <span>→</span>
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Remember your password?
                    </span>

                    <Link href="/login">
                        Log in
                    </Link>

                </div>

            </section>

        </main>
    );
}