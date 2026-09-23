export default function AboutPage() {
    return (
        <main className="about-page">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="about-hero">

                <div className="about-hero-content">

                    <p className="section-eyebrow">
                        ABOUT GLOWCARE
                    </p>

                    <h1>
                        Skincare,
                        <span>made beautifully simple.</span>
                    </h1>

                    <p className="about-hero-description">
                        Thoughtfully chosen skincare for real routines,
                        real skin and everyday glow.
                    </p>

                </div>

                <div className="about-hero-number">
                    03
                </div>

            </section>


           {/* =========================================
    OUR STORY
========================================= */}

<section className="about-story">

    {/* Left side */}
    <div className="about-story-visual">

        <p className="section-eyebrow">
            OUR STORY
        </p>

        <div className="about-story-image-wrap">
            <img
                src="/images/about/our-story.png"
                alt="GlowCare skincare"
                className="about-story-image"
            />
        </div>

    </div>


    {/* Right side */}
    <div className="about-story-content">

        <h2>
            Good skincare
            <span>doesn't need to be complicated.</span>
        </h2>

        <p>
            GlowCare was created around a simple idea:
            skincare should feel like a part of your
            everyday life, not another complicated task.
        </p>

        <p>
            We believe in thoughtful essentials that are
            easy to understand, easy to use and enjoyable
            to make part of your routine.
        </p>

    </div>

</section>

            {/* =========================================
                PHILOSOPHY
            ========================================= */}

            <section className="about-philosophy">

                <div className="about-section-heading">

                    <p className="section-eyebrow">
                        WHAT WE BELIEVE
                    </p>

                    <h2>
                        Simple choices.
                        <span>Thoughtful care.</span>
                    </h2>

                </div>


                <div className="about-values">

                    <article className="about-value-card">

                        <span className="about-value-number">
                            01
                        </span>

                        <div>

                            <p className="about-value-label">
                                SIMPLE
                            </p>

                            <h3>
                                Less complexity.
                            </h3>

                            <p>
                                Skincare should be easy to understand
                                and easy to make part of your day.
                            </p>

                        </div>

                    </article>


                    <article className="about-value-card">

                        <span className="about-value-number">
                            02
                        </span>

                        <div>

                            <p className="about-value-label">
                                THOUGHTFUL
                            </p>

                            <h3>
                                Chosen with care.
                            </h3>

                            <p>
                                We focus on everyday essentials that
                                fit naturally into your routine.
                            </p>

                        </div>

                    </article>


                    <article className="about-value-card">

                        <span className="about-value-number">
                            03
                        </span>

                        <div>

                            <p className="about-value-label">
                                EVERYDAY
                            </p>

                            <h3>
                                Made for real routines.
                            </h3>

                            <p>
                                Because good skincare is the skincare
                                you can actually enjoy using every day.
                            </p>

                        </div>

                    </article>

                </div>

            </section>


            {/* =========================================
                RITUAL
            ========================================= */}

            <section className="about-ritual">

                <div className="about-ritual-intro">

                    <p className="section-eyebrow">
                        THE GLOWCARE WAY
                    </p>

                    <h2>
                        Your routine,
                        <span>your ritual.</span>
                    </h2>

                    <p>
                        A few simple steps can become one of the
                        most enjoyable parts of your day.
                    </p>

                </div>


                <div className="about-ritual-steps">

                    <div className="about-ritual-step">

                        <span>01</span>

                        <p>CLEANSE</p>

                        <h3>
                            Start fresh.
                        </h3>

                        <a href="/products?category=face-wash">
                            Face Wash →
                        </a>

                    </div>


                    <div className="about-ritual-step">

                        <span>02</span>

                        <p>TREAT</p>

                        <h3>
                            Give your skin care.
                        </h3>

                        <a href="/products?category=serums">
                            Serums →
                        </a>

                    </div>


                    <div className="about-ritual-step">

                        <span>03</span>

                        <p>HYDRATE</p>

                        <h3>
                            Lock in the glow.
                        </h3>

                        <a href="/products?category=moisturizers">
                            Moisturizers →
                        </a>

                    </div>

                </div>

            </section>


            {/* =========================================
                STATEMENT
            ========================================= */}

            <section className="about-statement">

                <p>
                    “Skincare should feel like
                    <span>care, not a chore.</span>”
                </p>

            </section>


            {/* =========================================
                CTA
            ========================================= */}

            <section className="about-cta">

                <p className="section-eyebrow">
                    FIND YOUR ESSENTIALS
                </p>

                <h2>
                    Ready to build
                    <span>your ritual?</span>
                </h2>

                <a
                    href="/products"
                    className="primary-button"
                >
                    Explore Collection
                    <span>→</span>
                </a>

            </section>

        </main>
    );
}