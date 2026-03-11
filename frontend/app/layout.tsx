import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "LokDrishti — Civic Intelligence for India",
  description:
    "Data-driven analytics on the performance of India's 544 Members of Parliament.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ paddingTop: "64px" }}>
            {children}
          </main>
          <footer
            style={{
              background: "#0A1628",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "32px 80px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.3)",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span>
              <span style={{ color: "#FF6B00", fontWeight: 700 }}>LokDrishti</span>
              {" "}· Civic Intelligence Engine
            </span>
            <span>18th Lok Sabha · Data: PRS Legislative Research</span>
          </footer>
        </Providers>
      </body>
    </html>
  );
}