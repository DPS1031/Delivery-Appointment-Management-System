"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getStoredUser, logout } from "@/features/auth/api";
import { User } from "@/shared/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/appointments", label: "Appointments" },
  { href: "/reports", label: "Reports" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(stored);
  }, [router]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const navPill = (active: boolean) => ({
    padding: "7px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: active ? 500 : 400,
    color: active ? "#111827" : "#6b7280",
    backgroundColor: active ? "#f3f4f6" : "transparent",
    textDecoration: "none",
    display: "block",
    border: active ? "1px solid #e5e7eb" : "1px solid transparent",
    cursor: "pointer",
    fontFamily: "inherit",
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "white",
        borderBottom: "1px solid #f3f4f6",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "32px", height: "32px",
                backgroundColor: "#111827",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "white", fontSize: "14px", fontWeight: 700 }}>D</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: "15px", color: "#111827" }} className="sm-show">
                Delivery System
              </span>
            </Link>

            <nav style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} style={navPill(pathname === item.href)}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Username pill */}
            <div style={{
              padding: "7px 14px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 400,
              color: "#374151",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <div style={{
                width: "20px", height: "20px",
                backgroundColor: "#111827",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="sm-show">{user?.username}</span>
            </div>

            {/* Sign out pill */}
            <button
              onClick={handleLogout}
              style={{
                padding: "7px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#6b7280",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Sign out
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                padding: "6px",
                borderRadius: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "none",
              }}
              className="mobile-menu-btn"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#374151" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            borderTop: "1px solid #f3f4f6",
            padding: "8px 24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={navPill(pathname === item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .sm-show { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .sm-show { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
