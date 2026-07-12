// components/music-mixer/WhatsAppCTA.tsx
//
// Shared funnel CTA — same pattern every free tool should reuse: a
// pre-filled wa.me link, no backend, no API key.

interface WhatsAppCTAProps {
  toolName: string;
  phoneNumber: string; // digits only, country code first, e.g. "91XXXXXXXXXX"
}

export default function WhatsAppCTA({ toolName, phoneNumber }: WhatsAppCTAProps) {
  const message = `Hi, I used ${toolName} on your site, I need custom/professional work`;
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mixer-whatsapp-cta">
      Chat on WhatsApp — get this done professionally
    </a>
  );
}
