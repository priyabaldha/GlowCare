"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const response = await fetch(
                "/api/profile"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                window.location.href = "/login";
                return;
            }

            setFormData({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                street:
                    data.user.address?.street || "",
                city:
                    data.user.address?.city || "",
                state:
                    data.user.address?.state || "",
                pincode:
                    data.user.address?.pincode || "",
            });
        } catch (error) {
            console.error(
                "Fetch profile error:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setMessage("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        phone: formData.phone,
                        address: {
                            street:
                                formData.street,
                            city:
                                formData.city,
                            state:
                                formData.state,
                            pincode:
                                formData.pincode,
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to update profile."
                );
                return;
            }

            setMessage(
                "Your profile has been updated."
            );
        } catch (error) {
            console.error(
                "Save profile error:",
                error
            );

            setMessage(
                "Something went wrong. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="profile-page">
                <div className="profile-loading">
                    Loading your account...
                </div>
            </main>
        );
    }

    const initial =
        formData.name
            ?.trim()
            .charAt(0)
            .toUpperCase() || "U";

    return (
        <main className="profile-page">

            {/* =================================
                PROFILE HERO
            ================================= */}

            <section className="profile-hero">

                <div className="profile-hero-inner">

                    <div className="profile-avatar">
                        {initial}
                    </div>

                    <div className="profile-identity">

                        <p className="section-eyebrow">
                            GLOWCARE ACCOUNT
                        </p>

                        <h1>
                            {formData.name}
                        </h1>

                        <p>
                            {formData.email}
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================
                PROFILE LAYOUT
            ================================= */}

            <section className="profile-layout">

                {/* =================================
                    SIDEBAR
                ================================= */}

                <aside className="profile-navigation">

                    <div className="profile-nav-label">
                        MY ACCOUNT
                    </div>

                    <Link
                        href="/profile"
                        className="profile-nav-item profile-nav-active"
                    >
                        <span>Profile</span>
                        <span>→</span>
                    </Link>

                    <Link
                        href="/orders"
                        className="profile-nav-item"
                    >
                        <span>My orders</span>
                        <span>→</span>
                    </Link>

                    <div className="profile-nav-note">
                        <span>✦</span>
                        Your saved details are
                        automatically used at
                        checkout.
                    </div>

                </aside>


                {/* =================================
                    MAIN FORM
                ================================= */}

                <form
                    className="profile-main"
                    onSubmit={handleSubmit}
                >

                    {/* PERSONAL INFORMATION */}

                    <section className="profile-card">

                        <div className="profile-card-header">

                            <div>
                                <p className="section-eyebrow">
                                    PERSONAL
                                </p>

                                <h2>
                                    Personal information
                                </h2>
                            </div>

                            <span className="profile-card-number">
                                01
                            </span>

                        </div>

                        <div className="profile-grid">

                            <div className="profile-field profile-field-full">
                                <label>
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    disabled
                                />

                                <small>
                                    Account email
                                </small>
                            </div>

                            <div className="profile-field">
                                <label>
                                    Phone number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="10-digit phone number"
                                />
                            </div>

                        </div>

                    </section>


                    {/* DELIVERY ADDRESS */}

                    <section className="profile-card">

                        <div className="profile-card-header">

                            <div>
                                <p className="section-eyebrow">
                                    DELIVERY
                                </p>

                                <h2>
                                    Saved address
                                </h2>
                            </div>

                            <span className="profile-card-number">
                                02
                            </span>

                        </div>

                        <p className="profile-card-description">
                            Save your usual delivery
                            address so checkout is
                            quicker next time.
                        </p>

                        <div className="profile-grid">

                            <div className="profile-field profile-field-full">
                                <label>
                                    Street address
                                </label>

                                <textarea
                                    name="street"
                                    value={
                                        formData.street
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="House / Flat / Street / Area"
                                    rows="4"
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="City"
                                />
                            </div>

                            <div className="profile-field">
                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        formData.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="State"
                                />
                            </div>

                            <div className="profile-field profile-field-small">
                                <label>
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={
                                        formData.pincode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="6-digit pincode"
                                    maxLength="6"
                                />
                            </div>

                        </div>

                    </section>


                    {/* SAVE BAR */}

                    <div className="profile-save-bar">

                        <div>

                            {message ? (
                                <p className="profile-success">
                                    <span>✓</span>
                                    {message}
                                </p>
                            ) : (
                                <p>
                                    Changes will be
                                    saved to your account.
                                </p>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="profile-save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save changes"}

                            <span>→</span>
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}