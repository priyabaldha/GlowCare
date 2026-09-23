"use client";

import { useState } from "react";

const faqSections = [
    {
        number: "01",
        title: "Products & Skincare",
        questions: [
            {
                question:
                    "What skin types are GlowCare products suitable for?",
                answer:
                    "Our collection includes everyday skincare designed for different skin needs. We recommend checking each product description to choose the option that best matches your skin and routine.",
            },
            {
                question:
                    "How do I choose the right product for my skin?",
                answer:
                    "Start by identifying what your skin needs most, such as cleansing, hydration, treatment or protection. You can explore our categories to find products designed for each step of your routine.",
            },
            {
                question:
                    "Can I use multiple GlowCare products together?",
                answer:
                    "Yes. Our products are designed to fit into a simple skincare routine. A basic routine can include cleansing, treatment and hydration. Always introduce new products gradually and follow the product instructions.",
            },
            {
                question:
                    "How often should I use skincare products?",
                answer:
                    "Usage depends on the specific product. Check the individual product instructions for recommended use. Some products may be suitable for daily use, while others may be intended for less frequent application.",
            },
        ],
    },
    {
        number: "02",
        title: "Orders & Shipping",
        questions: [
            {
                question:
                    "How can I track my order?",
                answer:
                    "Once your order has been shipped, you can check your order details from your account to view the available shipping and tracking information.",
            },
            {
                question:
                    "How long does delivery take?",
                answer:
                    "Delivery time can vary depending on your location and the shipping service used. Your order details will contain the relevant delivery information once your order has been confirmed.",
            },
            {
                question:
                    "Can I cancel my order?",
                answer:
                    "If your order has not yet progressed too far in the fulfilment process, cancellation may be possible. Please check your order details or contact us as soon as possible.",
            },
            {
                question:
                    "Can I change my delivery address after ordering?",
                answer:
                    "Please contact us as soon as possible if you need to change your delivery address. Changes may not be possible once an order has already been shipped.",
            },
        ],
    },
    {
        number: "03",
        title: "Payments & Returns",
        questions: [
            {
                question:
                    "What payment methods do you accept?",
                answer:
                    "GlowCare currently supports the payment methods available during checkout, including UPI, card payments and Cash on Delivery where available.",
            },
            {
                question:
                    "Can I return a product?",
                answer:
                    "Return eligibility depends on the condition of the product and the applicable order policy. Please contact us with your order details if you need help with a return.",
            },
            {
                question:
                    "What if I receive a damaged product?",
                answer:
                    "If your order arrives damaged, please contact us with your order details and clear photographs of the package and product so we can help resolve the issue.",
            },
            {
                question:
                    "What happens if I receive the wrong product?",
                answer:
                    "Please contact us as soon as possible with your order details. We will review the issue and help you with the next steps.",
            },
        ],
    },
    {
        number: "04",
        title: "Account & Wishlist",
        questions: [
            {
                question:
                    "Do I need an account to shop?",
                answer:
                    "An account allows you to manage your profile, orders and saved products more easily. You can create an account using the registration option on GlowCare.",
            },
            {
                question:
                    "Where can I see my previous orders?",
                answer:
                    "After logging in, you can visit your Orders section to view your previous purchases and their current status.",
            },
            {
                question:
                    "What happens to products I add to my wishlist?",
                answer:
                    "Your wishlist keeps products you want to save for later so you can easily return to them and add them to your bag whenever you're ready.",
            },
        ],
    },
];

export default function FAQPage() {
    const [openItem, setOpenItem] = useState(null);

    function toggleItem(sectionIndex, questionIndex) {
        const id = `${sectionIndex}-${questionIndex}`;

        setOpenItem((current) =>
            current === id ? null : id
        );
    }

    return (
        <main className="gc-faq-page">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="gc-faq-hero">

                <div className="gc-faq-hero-content">

                    <p className="gc-faq-eyebrow">
                        GLOWCARE FAQ
                    </p>

                    <h1>
                        Frequently
                        <span>asked questions.</span>
                    </h1>

                    <p className="gc-faq-intro">
                        Everything you need to know about
                        GlowCare, your skincare routine,
                        orders and more.
                    </p>

                </div>

                <div className="gc-faq-hero-shape">
                    <span>?</span>
                </div>

                <div className="gc-faq-hero-number">
                    04
                </div>

            </section>


            {/* =========================================
                FAQ INTRO
            ========================================= */}

            <section className="gc-faq-intro-strip">

                <p>
                    A little clarity goes a long way.
                </p>

                <span>
                    Find answers to the things
                    you want to know.
                </span>

            </section>


            {/* =========================================
                FAQ LIST
            ========================================= */}

            <section className="gc-faq-content">

                {faqSections.map(
                    (section, sectionIndex) => (
                        <article
                            className="gc-faq-section"
                            key={section.title}
                        >

                            <div className="gc-faq-section-side">

                                <span className="gc-faq-section-number">
                                    {section.number}
                                </span>

                                <h2>
                                    {section.title}
                                </h2>

                            </div>


                            <div className="gc-faq-list">

                                {section.questions.map(
                                    (
                                        item,
                                        questionIndex
                                    ) => {

                                        const id =
                                            `${sectionIndex}-${questionIndex}`;

                                        const isOpen =
                                            openItem === id;

                                        return (
                                            <div
                                                key={
                                                    item.question
                                                }
                                                className={`gc-faq-item ${
                                                    isOpen
                                                        ? "gc-faq-item-open"
                                                        : ""
                                                }`}
                                            >

                                                <button
                                                    type="button"
                                                    className="gc-faq-question"
                                                    onClick={() =>
                                                        toggleItem(
                                                            sectionIndex,
                                                            questionIndex
                                                        )
                                                    }
                                                    aria-expanded={
                                                        isOpen
                                                    }
                                                >

                                                    <span className="gc-faq-question-text">
                                                        {
                                                            item.question
                                                        }
                                                    </span>

                                                    <span className="gc-faq-icon">
                                                        {isOpen
                                                            ? "−"
                                                            : "+"}
                                                    </span>

                                                </button>


                                                <div
                                                    className="gc-faq-answer"
                                                    style={{
                                                        maxHeight:
                                                            isOpen
                                                                ? "350px"
                                                                : "0px",
                                                    }}
                                                >

                                                    <p>
                                                        {
                                                            item.answer
                                                        }
                                                    </p>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </article>
                    )
                )}

            </section>


            {/* =========================================
                CONTACT CTA
            ========================================= */}

            <section className="gc-faq-cta">

                <div className="gc-faq-cta-content">

                    <p className="gc-faq-eyebrow">
                        STILL HAVE QUESTIONS?
                    </p>

                    <h2>
                        We're here
                        <span>to help.</span>
                    </h2>

                    <p>
                        Didn't find what you were looking for?
                        Get in touch with the GlowCare team.
                    </p>

                    <a
                        href="mailto:hello@glowcare.com"
                        className="gc-faq-contact"
                    >
                        Contact Us
                        <span>→</span>
                    </a>

                </div>

                <div className="gc-faq-cta-number">
                    05
                </div>

            </section>

        </main>
    );
}