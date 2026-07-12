"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const TypographyLab = dynamic(() => import("@/components/design-tools/TypographyLab.jsx"), { ssr: false });

export default function TypographyToolPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFCF9", color: "#1B1410", fontFamily: "var(--font-inter), sans-serif" }}>
      <Navbar />
      <div style={{ height: "60px", display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid #FFE6D4", paddingTop: "80px", boxSizing: "content-box" }}>
        <Link href="/tools" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", color: "#5B4E46", fontSize: "14px", fontWeight: 600 }}>
          <ArrowLeft size={16} />
          Back to Tools
        </Link>
      </div>
      <div style={{ minHeight: "calc(100vh - 140px)" }}>
        <TypographyLab />
      </div>
    </div>
  );
}
