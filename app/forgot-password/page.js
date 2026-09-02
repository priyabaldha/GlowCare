"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                        "Something went wrong."
                );
                return;
            }

            setMessage(data.message);
            setEmail("");
        } catch (error) {
            setError(
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="forgot-page">
            <div className="forgot-card">

                <div className="forgot-icon">
                    ✦
                </div>

                <p className="forgot-eyebrow">
                    GLOWCARE ACCOUNT
                </p>

                <h1>
                    Forgot your password?
                </h1>

                <p className="forgot-description">
                    Enter the email address associated
                    with your account and we'll help you
                    get back in.
                </p>

                {message && (
                    <div className="forgot-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="forgot-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="forgot-form"
                >
                    <div className="forgot-field">
                        <label htmlFor="email">
                            EMAIL ADDRESS
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="forgot-button"
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>
                </form>

                <Link
                    href="/login"
                    className="forgot-back"
                >
                    ← Back to login
                </Link>

            </div>
        </main>
    );
}