import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";

export const metadata: Metadata = {
  title: "LokDrishti — Civic Intelligence for India",
  description:
    "Data-driven analytics on the performance of Members of Parliament in India's 18th Lok Sabha.",
  keywords: ["India", "MP", "Parliament", "Lok Sabha", "civic data", "analytics"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer
          style={{
            background: "var(--navy)",
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "32px 24px",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            marginTop: "80px",
          }}
        >
          <span style={{ color: "var(--saffron)", fontWeight: 600 }}>
            LokDrishti
          </span>{" "}
          · Civic Intelligence Engine · 18th Lok Sabha · Built with open data
        </footer>
      </body>
    </html>
  );
}