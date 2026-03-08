"use client";
import { useEffect, useState } from "react";

export default function AshokaChakra() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 543;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "730px",
        height: "730px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(10,22,40,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          borderRadius: "50%",
          opacity: 0.4,
        }}
      />
              
        {/* glow halo */}
<div
  style={{
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0.12) 30%, transparent 70%)",
    filter: "blur(60px)",
    zIndex: 0,
    animation: "chakraGlow 6s ease-in-out infinite",

  }}
/>

      {/* rotating chakra */}
      <div
        style={{
          width: "720px",
          height: "720px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "rotateChakra 40s linear infinite",
        }}
      >
        <img
          src="/ashoka.svg"
          alt="Ashoka Chakra"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* center data */}
      <div
        style={{
          position: "absolute",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "54px",
            fontWeight: "700",
            color: "#f4f6f8",
          }}
        >
          {count}
        </div>

        <div
          style={{
            fontSize: "12px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#6B7A8D",
          }}
        >
          MPs
        </div>

        <div
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#FF6B00",
            fontWeight: "600",
          }}
        >
          18th Lok Sabha
        </div>
      </div>
    </div>
  );
}