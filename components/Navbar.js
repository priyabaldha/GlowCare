"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================
  // CHECK CURRENT USER
  // =========================================

  useEffect(() => {
    // Admin pages have their own sidebar/navbar
    // so there is no need to check the user here.
    if (pathname.startsWith("/admin")) {
      setLoading(false);
      return;
    }

    checkUser();
  }, [pathname]);

  async function checkUser() {
    try {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Failed to check user:",
        error
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // LOGOUT
  // =========================================

  async function handleLogout() {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Logout API error:",
          errorText
        );

        return;
      }

      const data =
        await response.json();

      if (data.success) {
        // Remove user immediately
        setUser(null);

        // Go to login page
        window.location.href =
          "/login";
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  // =========================================
  // HIDE CUSTOMER NAVBAR ON ADMIN PAGES
  // =========================================

  if (pathname.startsWith("/admin")) {
    return null;
  }

  // =========================================
  // NAVBAR
  // =========================================

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =================================
            LOGO
        ================================= */}

        <Link
          href="/"
          className="logo"
        >
          GlowCare
        </Link>


        {/* =================================
            NAVIGATION LINKS
        ================================= */}

        <nav className="nav-links">

          {user?.role === "admin" ? (
            <>
              {/* Admin user */}

              <Link href="/admin">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              {/* Normal user */}

              <Link href="/">
                Home
              </Link>

              <Link href="/products">
                Shop
              </Link>

              <Link href="/about">
                About
              </Link>
            </>
          )}

        </nav>


        {/* =================================
            ACTIONS
        ================================= */}

        <div className="nav-actions">

          {/* =================================
              SEARCH + WISHLIST + CART

              Only for normal users
          ================================= */}

          {user?.role !== "admin" && (
            <>

              {/* Search */}

              <button
                type="button"
                className="icon-button"
                aria-label="Search"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path d="m20 20-4-4" />
                </svg>
              </button>


              {/* Wishlist */}

              <Link
                href="/wishlist"
                className="icon-button"
                aria-label="Wishlist"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7C3.2 5.8 5.3 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4c2.5 0 4.6 1.8 4.6 4.7Z"
                  />
                </svg>
              </Link>


              {/* Cart */}

              <Link
                href="/cart"
                className="icon-button"
                aria-label="Shopping cart"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                  />

                  <circle
                    cx="10"
                    cy="20"
                    r="1"
                  />

                  <circle
                    cx="18"
                    cy="20"
                    r="1"
                  />
                </svg>
              </Link>

            </>
          )}


          {/* =================================
              AUTHENTICATION
          ================================= */}

          {!loading && (
            user ? (
              <>

                {/* Logged-in user */}

                <span className="navbar-user">
                  {user.role === "admin"
                    ? "Admin"
                    : `Hi, ${user.name}`}
                </span>


                {/* Logout */}

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            ) : (

              /* Logged-out user */

              <Link
                href="/login"
                className="login-button"
              >
                Login
              </Link>

            )
          )}

        </div>

      </div>

    </header>
  );
}