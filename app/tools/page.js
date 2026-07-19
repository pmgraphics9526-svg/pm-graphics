"use client";

import React from "react";
import Link from "next/link";
import { Palette, Type, Shapes, LayoutGrid, Music, Scissors, Sparkles, Mic2, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import WhatsAppCTA from "@/components/music-mixer/WhatsAppCTA";
import "./tools.css"; // Import new stylesheet
import "./music-mixer/music-mixer.css";

const designTools = [
  {
    title: "Colour",
    description: "Interactive color wheel to build professional, harmonious brand palettes.",
    icon: <Palette size={20} />,
    href: "/tools/color"
  },
  {
    title: "Typography",
    description: "Preview Google Fonts instantly to find the perfect pairing for your brand.",
    icon: <Type size={20} />,
    href: "/tools/typography"
  },
  {
    title: "Shapes",
    description: "Explore geometric and organic shapes and understand their psychological impact.",
    icon: <Shapes size={20} />,
    href: "/tools/shape"
  },
  {
    title: "Layout",
    description: "Learn to build structured layouts using grids, hierarchy, and whitespace.",
    icon: <LayoutGrid size={20} />,
    href: "/tools/layout"
  }
];

const audioTools = [
  {
    title: "Audio Trim",
    description: "Upload an audio file, select the exact portion you want to keep, and download the trimmed MP3 instantly.",
    icon: <Scissors size={20} />,
    href: "/tools/audio-trim"
  },
  {
    title: "Noise Reduce",
    description: "Upload a voice recording and let our AI-powered denoiser remove background hiss and hum.",
    icon: <Sparkles size={20} />,
    href: "/tools/noise-reduce"
  },
  {
    title: "Music Mixer",
    description: "Cut and blend up to 4 songs into one seamless track with automatic crossfades and beat snapping.",
    icon: <Music size={20} />,
    href: "/tools/music-mixer"
  },
  {
    title: "Vocal Remover",
    description: "Upload a song and let an on-device AI model strip the vocals, leaving a clean instrumental track.",
    icon: <Mic2 size={20} />,
    href: "/tools/vocal-remover"
  }
];

const videoTools = [
  {
    title: "Video Editing",
    description: "Trim, crop, add text, and export your videos — plus AI-powered auto-editing.",
    icon: <Video size={20} />,
    href: "/tools/video-editing"
  }
];

function ToolCard({ tool }) {
  return (
    <div className="tool-card-ui">
      <div className="tool-card-header">
        <div className="tool-icon-wrapper">
          {tool.icon}
        </div>
        <h3>{tool.title}</h3>
      </div>

      <p className="tool-description">{tool.description}</p>

      <Link href={tool.href} className="tool-btn">
        Open Tool
      </Link>
    </div>
  );
}

export default function ToolsHubPage() {
  return (
    <div className="tools-page">
      <Navbar />
      
      <header className="tools-hero">
        <h1><span>Pro Tools.</span> No Cost.</h1>
        <p>
          Free, professional-grade utilities built by PM Graphics to speed up your creative workflow and test drive our design processes.
        </p>
      </header>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>
        
        <section className="tools-section">
          <div className="section-header">
            <span className="dot"></span>
            <h2>Audio Tools</h2>
          </div>
          <div className="tools-grid">
            {audioTools.map(tool => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <section className="tools-section">
          <div className="section-header">
            <span className="dot"></span>
            <h2>Design Tools</h2>
          </div>
          <div className="tools-grid">
            {designTools.map(tool => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <section className="tools-section">
          <div className="section-header">
            <span className="dot"></span>
            <h2>Video</h2>
          </div>
          <div className="tools-grid">
            {videoTools.map(tool => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </section>

        <div style={{ marginTop: "60px", display: "flex", justifyContent: "center" }}>
          <WhatsAppCTA toolName="PM Graphics Tools" phoneNumber="919101811613" />
        </div>

      </main>
    </div>
  );
}
