"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log("Order details:", formData);
        console.log("Cart:", cartItems);
    }

    if (cartItems.length === 0) {
        return (
            <main className="checkout-page">
                <section className="checkout-empty">

                    <p className="section-eyebrow">
                        CHECKOUT
                    </p>

                    <h1>
                        Your bag is
                        <span>empty.</span>
                    </h1>

                    <p>
                        Add something to your bag
                        before checking out.
                    </p>

                    <Link
                        href="/products"
                        className="primary-button"
                    >
                        Explore Products
                        <span>→</span>
                    </Link>

                </section>
            </main>
        );
    }

    return (
        <main className="checkout-page">

            {/* Header */}
            <section className="checkout-header">

                <p className="section-eyebrow">
                    GLOWCARE CHECKOUT
                </p>

                <h1>
                    Complete your
                    <span>order.</span>
                </h1>

            </section>

            <section className="checkout-content">

                {/* Shipping Form */}
                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Delivery details
                    </h2>

                    <div className="checkout-field">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                        />
                    </div>

                    <div className="checkout-field">
                        <label>Phone</label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Your phone number"
                            required
                        />
                    </div>

                    <div className="checkout-field">
                        <label>Address</label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="House / Street / Area"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="checkout-row">

                        <div className="checkout-field">
                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>

                        <div className="checkout-field">
                            <label>State</label>

                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                required
                            />
                        </div>

                    </div>

                    <div className="checkout-field">
                        <label>Pincode</label>

                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="6-digit pincode"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="checkout-button"
                    >
                        Place Order
                        <span>→</span>
                    </button>

                </form>

                {/* Order Summary */}
                <aside className="checkout-summary">

                    <p className="summary-eyebrow">
                        ORDER SUMMARY
                    </p>

                    <h2>
                        Your essentials
                    </h2>

                    <div className="checkout-products">

                        {cartItems.map((item) => (
                            <div
                                className="checkout-product"
                                key={item.id}
                            >
                                <div>
                                    <strong>
                                        {item.name}
                                    </strong>

                                    <span>
                                        Qty: {item.quantity}
                                    </span>
                                </div>

                                <span>
                                    ₹
                                    {item.price *
                                        item.quantity}
                                </span>
                            </div>
                        ))}

                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>
                            ₹{cartTotal}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">
                        <span>Total</span>

                        <strong>
                            ₹{cartTotal}
                        </strong>
                    </div>

                </aside>

            </section>

        </main>
    );
}