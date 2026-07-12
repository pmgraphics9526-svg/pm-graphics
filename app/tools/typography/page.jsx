"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const TypographyLab = dynamic(() => import("@/components/design-tools/TypographyLab.jsx"), { ssr: false });

export default function TypographyToolPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background, #0B0B0B)", color: "#EDEDED", fontFamily: "var(--font-inter), sans-serif" }}>
      <Navbar showBack backHref="/tools" />
      <div style={{ paddingTop: "80px", minHeight: "calc(100vh - 80px)" }}>
        <TypographyLab />
      </div>
    </div>
  );
}
