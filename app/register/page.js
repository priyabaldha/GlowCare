"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password:
                            formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            // Registration successful
            // Send user to login page
            router.push("/login");

        } catch (error) {
            console.error(
                "Registration error:",
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
                        WELCOME TO GLOWCARE
                    </p>

                    <h1>
                        Create your
                        <span>account.</span>
                    </h1>

                    <p>
                        Join GlowCare and make your
                        everyday skincare ritual a
                        little more personal.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                        />

                    </div>

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

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            placeholder="Enter password again"
                            required
                        />

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
                            ? "Creating account..."
                            : "Create Account"}

                        <span>→</span>
                    </button>

                </form>

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link href="/login">
                        Log in
                    </Link>

                </div>

            </section>

        </main>
    );
}