"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  // Check who is currently logged in
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

  // Logout
  async function handleLogout() {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      // Don't try response.json() if the server
      // returned an error or empty response.
      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Logout API error:",
          errorText
        );

        return;
      }

      const data = await response.json();

      if (data.success) {
        // Remove user from Navbar immediately
        setUser(null);

        // Send both admin and normal users
        // to the general login page.
        window.location.href = "/login";
      }

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <Link
          href="/"
          className="logo"
        >
          GlowCare
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">

          {user?.role === "admin" ? (
            <>
              {/* Admin Navigation */}
              <Link href="/admin">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              {/* User Navigation */}
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

        {/* Actions */}
        <div className="nav-actions">

          {/* Search + Cart
              Only visible to normal users */}
          {user?.role !== "admin" && (
            <>
              {/* Search */}
              <button
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
                >
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />

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

          {/* Authentication */}
          {!loading && (
            user ? (
              <>
                {/* Logged-in user */}
                <span className="navbar-user">
                  {user.role === "admin"
                    ? "Admin"
                    : `Hi, ${user.name}`}
                </span>

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