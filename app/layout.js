import { Syne, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "PM Graphics — Strategic Brand & High-End Design Studio",
  description: "The premium portfolio of PM Graphics. Luxury minimalism, high-impact brand identity, event visuals, flyers, and video editing for visionary brands.",
  metadataBase: new URL("https://pmgraphics.in"),
  alternates: { canonical: "https://pmgraphics.in" },
  openGraph: {
    title: "PM Graphics — Strategic Brand & High-End Design Studio",
    description: "Premium branding, event visuals, flyers, and video editing studio based in Jorhat, Assam.",
    type: "website",
    locale: "en_US",
    url: "https://pmgraphics.in",
    siteName: "PM Graphics",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Graphics — Strategic Brand & High-End Design Studio",
    description: "Premium branding, event visuals, flyers, and video editing.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "PM Graphics",
  description: "Premium graphic design studio specializing in brand identity, event visuals, flyers, and video editing.",
  url: "https://pmgraphics.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jorhat",
    addressRegion: "Assam",
    postalCode: "785001",
    addressCountry: "IN",
  },
  email: "pmgraphics9526@gmail.com",
  priceRange: "₹₹",
  serviceType: ["Brand Identity Design", "Event Visuals", "Flyer Design", "Video Editing"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
