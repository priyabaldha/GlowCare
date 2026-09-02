"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            router.push(data.redirect);
            router.refresh();

        } catch (error) {
            console.error(
                "Login error:",
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
                        WELCOME BACK
                    </p>

                    <h1>
                        Come back to
                        <span>your glow.</span>
                    </h1>

                    <p>
                        Log in to continue your
                        GlowCare journey.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <div className="password-label-row">

                            <label>Password</label>
                        </div>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Your password"
                            required
                        />
                        <Link
                            href="/forgot-password"
                            className="forgot-password-link"
                        >
                            Forgot password?
                        </Link>

                    </div>

                    {error && (
                        <p className="auth-message error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Log In"}

                        <span>→</span>
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link href="/register">
                        Create one
                    </Link>

                </div>

            </section>

        </main>
    );
}