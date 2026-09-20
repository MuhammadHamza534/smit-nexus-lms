"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "student" | "trainer" | "admin";

interface Credential {
  role: Role;
  email: string;
  password: string;
  name: string;
}

const credentials: Credential[] = [
  {
    role: "student",
    email: "student@smit.com",
    password: "student123",
    name: "Muhammad Hamza",
  },
  {
    role: "trainer",
    email: "trainer@smit.com",
    password: "trainer123",
    name: "Ahmed Khan",
  },
  {
    role: "admin",
    email: "admin@smit.com",
    password: "admin123",
    name: "SMIT Admin",
  },
];

function MailIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="10"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.8 18.8 0 0 1-3 3.8" />
      <path d="M6.6 6.6C3.8 8.7 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("student@smit.com");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCredential = credentials.find(
    (item) => item.role === role
  );

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setError("");

    const credential = credentials.find(
      (item) => item.role === newRole
    );

    if (credential) {
      setEmail(credential.email);
      setPassword(credential.password);
    }
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const credential = credentials.find(
      (item) =>
        item.role === role &&
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.password === password
    );

    if (!credential) {
      setError(
        "Invalid email or password. Please check your credentials."
      );
      return;
    }

    setLoading(true);

    localStorage.setItem(
      "lms-user",
      JSON.stringify({
        role: credential.role,
        email: credential.email,
        name: credential.name,
      })
    );

    if (credential.role === "student") {
      router.push("/student");
    } else if (credential.role === "trainer") {
      router.push("/trainer");
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-card">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-logo">SM</div>

            <div className="login-brand-text">
              <div className="login-brand-title">
                SMIT LMS
              </div>

              <div className="login-brand-subtitle">
                Learning Portal
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="login-heading">
            <h1>Welcome back</h1>

            <p>
              Sign in to continue to your learning portal
            </p>
          </div>

          {/* Role selector */}
          <div className="role-selector">
            {(["student", "trainer", "admin"] as Role[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={`role-button ${
                    role === item ? "active" : ""
                  }`}
                  onClick={() =>
                    handleRoleChange(item)
                  }
                >
                  {item.charAt(0).toUpperCase() +
                    item.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Login form */}
          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email">
                Email address
              </label>

              <div className="login-input">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                />

                <span className="login-input-icon">
                  <MailIcon />
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="login-input">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <LockIcon />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo credential info */}
          {selectedCredential && (
            <div className="login-demo-info">
              Demo account:{" "}
              <strong>
                {selectedCredential.email}
              </strong>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}