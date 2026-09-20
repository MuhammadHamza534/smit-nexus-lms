"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Role = "student" | "trainer" | "admin";

interface DashboardShellProps {
  children: React.ReactNode;
  role: Role;
  title: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: Record<Role, NavItem[]> = {
  student: [
    {
      label: "Dashboard",
      href: "/student",
      icon: "⌂",
    },
    {
      label: "Attendance",
      href: "/student/attendance",
      icon: "✓",
    },
    {
      label: "Assignments",
      href: "/student/assignments",
      icon: "▤",
    },
    {
      label: "Course Progress",
      href: "/student/progress",
      icon: "◫",
    },
  ],

  trainer: [
    {
      label: "Dashboard",
      href: "/trainer",
      icon: "⌂",
    },
    {
      label: "My Courses",
      href: "/trainer/courses",
      icon: "▦",
    },
    {
      label: "Attendance",
      href: "/trainer/attendance",
      icon: "✓",
    },
    {
      label: "Assignments",
      href: "/trainer/assignments",
      icon: "▤",
    },
    {
      label: "Course Progress",
      href: "/trainer/progress",
      icon: "◫",
    },
  ],

  admin: [
    {
      label: "Students",
      href: "/admin/students",
      icon: "♙",
    },
    {
      label: "Trainers",
      href: "/admin/trainers",
      icon: "♟",
    },
  ],
};

const roleNames: Record<Role, string> = {
  student: "Student",
  trainer: "Trainer",
  admin: "Administrator",
};

const accountNames: Record<Role, string> = {
  student: "Muhammad Hamza",
  trainer: "Ahmed Khan",
  admin: "SMIT Admin",
};

export default function DashboardShell({
  children,
  role,
  title,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const items = navItems[role];

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleNavigation = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("lms-user");
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(20,91,155,0.08), transparent 30%), #07101d",
        color: "#f8fafc",
      }}
    >
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background:
              "rgba(0,0,0,0.65)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: "250px",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(180deg, #081528 0%, #061222 100%)",
          borderRight:
            "1px solid rgba(75,150,225,0.14)",
          transform:
            mobileOpen
              ? "translateX(0)"
              : undefined,
        }}
        className="lms-sidebar"
      >
        {/* Logo */}
        <div
          style={{
            height: "78px",
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom:
              "1px solid rgba(75,150,225,0.12)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #269bea, #147dcc)",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 800,
              boxShadow:
                "0 8px 20px rgba(20,130,210,0.2)",
            }}
          >
            S
          </div>

          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1.2,
              }}
            >
              SMIT
            </div>

            <div
              style={{
                marginTop: "3px",
                fontSize: "10px",
                color: "#6f96bc",
                letterSpacing: "0.7px",
              }}
            >
              LEARNING PORTAL
            </div>
          </div>
        </div>

        {/* Role */}
        <div
          style={{
            margin: "20px 16px 12px",
            padding: "11px 13px",
            borderRadius: "10px",
            background:
              "rgba(56,167,255,0.07)",
            border:
              "1px solid rgba(56,167,255,0.12)",
          }}
        >
          <div
            style={{
              color: "#607995",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.7px",
              marginBottom: "4px",
            }}
          >
            Logged in as
          </div>

          <div
            style={{
              color: "#b9d4ed",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {roleNames[role]}
          </div>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: "8px 12px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              color: "#526f8e",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              padding: "0 10px 9px",
            }}
          >
            Navigation
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {items.map((item) => {
              const active = isActive(
                item.href
              );

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      item.href
                    )
                  }
                  style={{
                    width: "100%",
                    minHeight: "45px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0 12px",
                    border: active
                      ? "1px solid rgba(56,167,255,0.20)"
                      : "1px solid transparent",
                    borderRadius: "10px",
                    background: active
                      ? "linear-gradient(135deg, rgba(30,111,220,0.30), rgba(20,91,155,0.18))"
                      : "transparent",
                    color: active
                      ? "#f1f8ff"
                      : "#7f9bb8",
                    cursor: "pointer",
                    textAlign: "left",
                    transition:
                      "all 0.18s ease",
                  }}
                  onMouseEnter={(event) => {
                    if (!active) {
                      event.currentTarget.style.background =
                        "rgba(255,255,255,0.035)";
                      event.currentTarget.style.color =
                        "#c5d8eb";
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!active) {
                      event.currentTarget.style.background =
                        "transparent";
                      event.currentTarget.style.color =
                        "#7f9bb8";
                    }
                  }}
                >
                  <span
                    style={{
                      width: "29px",
                      height: "29px",
                      minWidth: "29px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      background: active
                        ? "rgba(56,167,255,0.12)"
                        : "rgba(255,255,255,0.025)",
                      color: active
                        ? "#38a7ff"
                        : "#7189a3",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    {item.icon}
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: active
                        ? 600
                        : 500,
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User / Logout */}
        <div
          style={{
            padding: "14px",
            borderTop:
              "1px solid rgba(75,150,225,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px",
              marginBottom: "7px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                minWidth: "34px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #1d78bd, #125b92)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {accountNames[role]
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  color: "#dbeafe",
                  fontSize: "12px",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {accountNames[role]}
              </div>

              <div
                style={{
                  marginTop: "2px",
                  color: "#607995",
                  fontSize: "10px",
                }}
              >
                {roleNames[role]}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderRadius: "9px",
              border:
                "1px solid rgba(239,68,68,0.16)",
              background:
                "rgba(239,68,68,0.06)",
              color: "#f87171",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div
        style={{
          minHeight: "100vh",
          marginLeft: "250px",
        }}
        className="lms-main"
      >
        {/* Topbar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            background:
              "rgba(7,16,29,0.92)",
            borderBottom:
              "1px solid rgba(75,150,225,0.12)",
            backdropFilter:
              "blur(16px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="mobile-menu-button"
              style={{
                width: "38px",
                height: "38px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9px",
                border:
                  "1px solid rgba(100,160,220,0.16)",
                background: "#091a2f",
                color: "#b8cce0",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ☰
            </button>

            <div>
              <h1
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "19px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h1>

              <div
                style={{
                  marginTop: "4px",
                  color: "#607995",
                  fontSize: "11px",
                }}
              >
                SMIT Learning Management
                System
              </div>
            </div>
          </div>

          {/* Topbar User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #269bea, #147dcc)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {accountNames[role]
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div
              className="topbar-user-name"
              style={{
                lineHeight: 1.2,
              }}
            >
              <div
                style={{
                  color: "#dbeafe",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {accountNames[role]}
              </div>

              <div
                style={{
                  marginTop: "3px",
                  color: "#607995",
                  fontSize: "10px",
                }}
              >
                {roleNames[role]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          style={{
            padding: "30px",
            minHeight:
              "calc(100vh - 72px)",
          }}
        >
          {children}
        </main>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        .lms-sidebar {
          transition: transform 0.25s ease;
        }

        .mobile-menu-button {
          display: none;
        }

        @media (max-width: 900px) {
          .lms-sidebar {
            transform: translateX(-100%);
          }

          .lms-main {
            margin-left: 0 !important;
          }

          .mobile-menu-button {
            display: flex !important;
          }
        }

        @media (max-width: 600px) {
          header {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          main {
            padding: 20px 15px !important;
          }

          .topbar-user-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}