"use client";

import { useEffect } from "react";

/**
 * Global Error Boundary
 *
 * This component catches errors in the root layout.
 * It must define its own <html> and <body> tags since it replaces the root layout.
 *
 * Must be a Client Component with 'use client' directive.
 *
 * Props:
 * - error: Error object containing message and digest
 * - reset: Function to attempt recovery
 *
 * Note: global-error.js is only enabled in production.
 * In development, the error overlay will show instead.
 *
 * Reference: https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              padding: "2rem",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "50%",
                  backgroundColor: "#fee2e2",
                  marginBottom: "1rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                치명적인 오류
              </h1>
              <p style={{ color: "#6b7280" }}>
                애플리케이션에 심각한 문제가 발생했습니다
              </p>
            </div>

            <div
              style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: "#f3f4f6",
                border: "1px solid #e5e7eb",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontFamily: "monospace",
                  wordBreak: "break-word",
                }}
              >
                {error.message || "알 수 없는 오류가 발생했습니다"}
              </p>
              {error.digest && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    marginTop: "0.5rem",
                  }}
                >
                  오류 ID: {error.digest}
                </p>
              )}
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => reset()}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
