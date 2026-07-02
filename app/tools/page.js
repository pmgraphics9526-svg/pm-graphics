"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Palette, Type, Shapes, LayoutGrid } from "lucide-react";

const ColorLab = dynamic(() => import("../../learning-tools/ColorLab.jsx"), { ssr: false });
const TypographyLab = dynamic(() => import("../../learning-tools/TypographyLab.jsx"), { ssr: false });
const ShapeLab = dynamic(() => import("../../learning-tools/ShapeLab.jsx"), { ssr: false });
const LayoutLab = dynamic(() => import("../../learning-tools/LayoutLab.jsx"), { ssr: false });

const theme = {
  cream: "#FFFCF9",
  ink: "#1B1410",
  inkSoft: "#5B4E46",
  orange500: "#FF8A47",
  orange600: "#FF6E2E",
  orange700: "#E85A1B",
  orange100: "#FFE6D4",
  orange50: "#FFF6EF",
  white: "#FFFFFF",
};

function ToolsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "typography" ? "typography" : 
    tabParam === "shape" ? "shape" : 
    tabParam === "layout" ? "layout" : 
    "color"
  );

  // Sync if URL param changes
  useEffect(() => {
    setActiveTab(
      tabParam === "typography" ? "typography" : 
      tabParam === "shape" ? "shape" : 
      tabParam === "layout" ? "layout" : 
      "color"
    );
  }, [tabParam]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.cream, color: theme.ink, fontFamily: "var(--font-inter), sans-serif" }}>

      {/* Top Bar */}
      <div style={{
        backgroundColor: theme.white,
        borderBottom: `1px solid ${theme.orange100}`,
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "24px",
        height: "60px",
      }}>
        {/* Back */}
        <Link href="/learning-tools/learning-hero.html" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", color: theme.inkSoft, fontSize: "14px", fontWeight: 600, flexShrink: 0 }}>
          <ArrowLeft size={16} />
          Back
        </Link>

        <div style={{ width: "1px", height: "20px", backgroundColor: theme.orange100 }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setActiveTab("color")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-inter), sans-serif",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              backgroundColor: activeTab === "color" ? theme.orange600 : "transparent",
              color: activeTab === "color" ? theme.white : theme.inkSoft,
            }}
          >
            <Palette size={15} strokeWidth={2} />
            Colour Theory Lab
          </button>
          <button
            onClick={() => setActiveTab("typography")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-inter), sans-serif",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              backgroundColor: activeTab === "typography" ? theme.orange600 : "transparent",
              color: activeTab === "typography" ? theme.white : theme.inkSoft,
            }}
          >
            <Type size={15} strokeWidth={2} />
            Typography Lab
          </button>
          <button
            onClick={() => setActiveTab("shape")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-inter), sans-serif",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              backgroundColor: activeTab === "shape" ? theme.orange600 : "transparent",
              color: activeTab === "shape" ? theme.white : theme.inkSoft,
            }}
          >
            <Shapes size={15} strokeWidth={2} />
            Shape Lab
          </button>
          <button
            onClick={() => setActiveTab("layout")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-inter), sans-serif",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              backgroundColor: activeTab === "layout" ? theme.orange600 : "transparent",
              color: activeTab === "layout" ? theme.white : theme.inkSoft,
            }}
          >
            <LayoutGrid size={15} strokeWidth={2} />
            Layout Lab
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: "calc(100vh - 60px)" }}>
        {activeTab === "color" && <ColorLab />}
        {activeTab === "typography" && <TypographyLab />}
        {activeTab === "shape" && <ShapeLab />}
        {activeTab === "layout" && <LayoutLab />}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <React.Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: theme.cream, display: "flex", alignItems: "center", justifyContent: "center", color: theme.inkSoft }}>
        Loading...
      </div>
    }>
      <ToolsContent />
    </React.Suspense>
  );
}
