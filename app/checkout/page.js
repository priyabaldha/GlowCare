"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
    const {
        cartItems,
        cartTotal,
    } = useCart();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] =
        useState("upi");

    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
    });

    const [loading, setLoading] =
        useState(false);

    function handleChange(event) {
        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleCardChange(event) {
        const {
            name,
            value,
        } = event.target;

        setCardData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);

        try {
            // Demo card validation
            if (paymentMethod === "card") {
                if (
                    !cardData.cardNumber ||
                    !cardData.cardName ||
                    !cardData.expiry ||
                    !cardData.cvv
                ) {
                    alert(
                        "Please enter all card details."
                    );

                    setLoading(false);
                    return;
                }
            }

            const response = await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        shippingAddress:
                            formData,

                        paymentMethod:
                            paymentMethod,
                    }),
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                alert(
                    data.message ||
                        "Failed to place order."
                );

                setLoading(false);
                return;
            }

            window.location.href =
                `/order-success?id=${data.order._id}`;

        } catch (error) {
            console.error(
                "Place order error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
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

                {/* Checkout Form */}
                <form
                    className="checkout-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Delivery details
                    </h2>

                    {/* Name */}
                    <div className="checkout-field">

                        <label>
                            Name
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

                    {/* Phone */}
                    <div className="checkout-field">

                        <label>
                            Phone
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
                            placeholder="Your phone number"
                            required
                        />

                    </div>

                    {/* Address */}
                    <div className="checkout-field">

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="House / Street / Area"
                            rows="4"
                            required
                        />

                    </div>

                    {/* City + State */}
                    <div className="checkout-row">

                        <div className="checkout-field">

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
                                required
                            />

                        </div>

                        <div className="checkout-field">

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
                                required
                            />

                        </div>

                    </div>

                    {/* Pincode */}
                    <div className="checkout-field">

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
                            required
                        />

                    </div>

                    {/* Payment */}
                    <div className="payment-section">

                        <h2>
                            Payment method
                        </h2>

                        <div className="payment-options">

                            {/* UPI */}
                            <button
                                type="button"
                                className={`payment-option ${
                                    paymentMethod ===
                                    "upi"
                                        ? "payment-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setPaymentMethod(
                                        "upi"
                                    )
                                }
                            >

                                <span className="payment-icon">
                                    UPI
                                </span>

                                <span>
                                    <strong>
                                        UPI
                                    </strong>

                                    <small>
                                        Google Pay,
                                        PhonePe,
                                        etc.
                                    </small>
                                </span>

                            </button>

                            {/* Card */}
                            <button
                                type="button"
                                className={`payment-option ${
                                    paymentMethod ===
                                    "card"
                                        ? "payment-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setPaymentMethod(
                                        "card"
                                    )
                                }
                            >

                                <span className="payment-icon">
                                    CARD
                                </span>

                                <span>
                                    <strong>
                                        Card
                                    </strong>

                                    <small>
                                        Credit or
                                        Debit Card
                                    </small>
                                </span>

                            </button>

                            {/* COD */}
                            <button
                                type="button"
                                className={`payment-option ${
                                    paymentMethod ===
                                    "cod"
                                        ? "payment-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setPaymentMethod(
                                        "cod"
                                    )
                                }
                            >

                                <span className="payment-icon">
                                    ₹
                                </span>

                                <span>
                                    <strong>
                                        Cash on
                                        Delivery
                                    </strong>

                                    <small>
                                        Pay when your
                                        order arrives
                                    </small>
                                </span>

                            </button>

                        </div>

                    </div>

                    {/* Card Details */}
                    {paymentMethod ===
                        "card" && (
                        <div className="card-details">

                            <h2>
                                Card details
                            </h2>

                            <div className="checkout-field">

                                <label>
                                    Card Number
                                </label>

                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={
                                        cardData.cardNumber
                                    }
                                    onChange={
                                        handleCardChange
                                    }
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    required
                                />

                            </div>

                            <div className="checkout-field">

                                <label>
                                    Card Holder Name
                                </label>

                                <input
                                    type="text"
                                    name="cardName"
                                    value={
                                        cardData.cardName
                                    }
                                    onChange={
                                        handleCardChange
                                    }
                                    placeholder="Name on card"
                                    required
                                />

                            </div>

                            <div className="checkout-row">

                                <div className="checkout-field">

                                    <label>
                                        Expiry
                                    </label>

                                    <input
                                        type="text"
                                        name="expiry"
                                        value={
                                            cardData.expiry
                                        }
                                        onChange={
                                            handleCardChange
                                        }
                                        placeholder="MM / YY"
                                        maxLength="7"
                                        required
                                    />

                                </div>

                                <div className="checkout-field">

                                    <label>
                                        CVV
                                    </label>

                                    <input
                                        type="password"
                                        name="cvv"
                                        value={
                                            cardData.cvv
                                        }
                                        onChange={
                                            handleCardChange
                                        }
                                        placeholder="•••"
                                        maxLength="4"
                                        required
                                    />

                                </div>

                            </div>

                            <p className="demo-payment-note">
                                Demo payment only. No
                                real money will be charged.
                            </p>

                        </div>
                    )}

                    {/* UPI Details */}
                    {paymentMethod ===
                        "upi" && (
                        <div className="upi-details">

                            <h2>
                                UPI payment
                            </h2>

                            <p>
                                This is a demo
                                payment. Click
                                the button below
                                to complete your
                                order.
                            </p>

                            <div className="demo-upi-box">
                                UPI PAYMENT
                            </div>

                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="checkout-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : paymentMethod ===
                              "cod"
                            ? "Place Order"
                            : `Pay ₹${cartTotal}`}

                        <span>
                            →
                        </span>
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

                        {cartItems.map(
                            (item) => (
                                <div
                                    className="checkout-product"
                                    key={item.id}
                                >

                                    <div>

                                        <strong>
                                            {
                                                item.name
                                            }
                                        </strong>

                                        <span>
                                            Qty:{" "}
                                            {
                                                item.quantity
                                            }
                                        </span>

                                    </div>

                                    <span>
                                        ₹
                                        {
                                            item.price *
                                            item.quantity
                                        }
                                    </span>

                                </div>
                            )
                        )}

                    </div>

                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{cartTotal}
                        </span>

                    </div>

                    <div className="summary-row">

                        <span>
                            Shipping
                        </span>

                        <span>
                            Free
                        </span>

                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{cartTotal}
                        </strong>

                    </div>

                </aside>

            </section>

        </main>
    );
}