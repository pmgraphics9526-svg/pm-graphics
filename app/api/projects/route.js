import { NextResponse } from "next/server";

const CATEGORY_IMAGES = {
  "BRANDING": [
    "/projects/BRANDING/aawdca1.png",
    "/projects/BRANDING/aawdca2.png",
    "/projects/BRANDING/b&s-1.png",
    "/projects/BRANDING/b&s-2.png",
    "/projects/BRANDING/bf-1.png",
    "/projects/BRANDING/bf2.png",
    "/projects/BRANDING/ck1.png",
    "/projects/BRANDING/dark-bean1.png",
    "/projects/BRANDING/dark-bean2.png",
    "/projects/BRANDING/fitzone1.png",
    "/projects/BRANDING/fitzone2.png",
    "/projects/BRANDING/greenleaf-01.png",
    "/projects/BRANDING/greenleaf-02.png",
    "/projects/BRANDING/royal-feast-02.png",
    "/projects/BRANDING/Royal1.jpg"
  ],
  "BACKDROPS": [
    "/projects/backdrops/backdrop1.png",
    "/projects/backdrops/backdrop2.JPG",
    "/projects/backdrops/backdrop3.JPG",
    "/projects/backdrops/backdrop4.png",
    "/projects/backdrops/backdrop5.jpg",
    "/projects/backdrops/backdrop6.jpg",
    "/projects/backdrops/backdrop7.JPG",
    "/projects/backdrops/backdrop8.jpg",
    "/projects/backdrops/backdrop9.png",
    "/projects/backdrops/backdrop10.png",
    "/projects/backdrops/backdrop11.png",
    "/projects/backdrops/backdrop12.jpg",
    "/projects/backdrops/bihu.jpg",
    "/projects/backdrops/dholida.jpg",
    "/projects/backdrops/galti-se-mistake.png",
    "/projects/backdrops/genda-phooll.jpg",
    "/projects/backdrops/itnisi-hasi.jpg",
    "/projects/backdrops/jadhu-ki-jhaapi.png",
    "/projects/backdrops/kangana.jpg",
    "/projects/backdrops/kar-gai-chull.jpg",
    "/projects/backdrops/mera-bala-dance.png",
    "/projects/backdrops/mere-naseeb-main.png",
    "/projects/backdrops/rock-the-party.jpg",
    "/projects/backdrops/WITHOUTME.png",
    "/projects/backdrops/ye-dil-diwana-x-jor-hole.jpg",
    "/projects/backdrops/yeh-ishqh.png"
  ],
  "FLYERS": [
    "/projects/FLYERS/campaign/campaign-1.png",
    "/projects/FLYERS/campaign/campaign-2.png",
    "/projects/FLYERS/campaign/campaign-3.png",
    "/projects/FLYERS/Corporate/Corporate1.png",
    "/projects/FLYERS/Corporate/Corporate2.png",
    "/projects/FLYERS/Corporate/Corporate3.png",
    "/projects/FLYERS/dance/b&s-1.png",
    "/projects/FLYERS/dance/b&s2.png",
    "/projects/FLYERS/dance/dancecamp1.png",
    "/projects/FLYERS/dance/dancecamp2.png",
    "/projects/FLYERS/file_00000000b548720bb95c246db9d32ce2.png",
    "/projects/FLYERS/file_00000000fcc072089ae215a123d266ef.png",
    "/projects/FLYERS/file_000000000954720884c0cdd058346c47.png",
    "/projects/FLYERS/IMG_20260620_154237.png",
    "/projects/FLYERS/invitation-flyer/2.png",
    "/projects/FLYERS/invitation-flyer/3.png",
    "/projects/FLYERS/invitation-flyer/4.png",
    "/projects/FLYERS/invitation-flyer/5.png",
    "/projects/FLYERS/invitation-flyer/7.png",
    "/projects/FLYERS/invitation-flyer/8.png",
    "/projects/FLYERS/invitation-flyer/9.png",
    "/projects/FLYERS/invitation-flyer/10.png",
    "/projects/FLYERS/invitation-flyer/19.png",
    "/projects/FLYERS/invitation-flyer/20.png",
    "/projects/FLYERS/jewelry-new-collection/jewelry-new-collection1.png",
    "/projects/FLYERS/jewelry-new-collection/jewelry-new-collection2.png",
    "/projects/FLYERS/jewelry-new-collection/jewelry-new-collection23.png",
    "/projects/FLYERS/real-state/real-estate-1.png",
    "/projects/FLYERS/real-state/real-estate-2.png",
    "/projects/FLYERS/red-and-gold-traditional-wedding-photo-collage_20260610_201033_0000.png",
    "/projects/FLYERS/white-modern-happy-wedding-photo-collage_20260610_201700_0000.png"
  ],
  "VIDEOS EDITING": []
};

export async function GET() {
  try {
    return NextResponse.json(CATEGORY_IMAGES);
  } catch (error) {
    console.error("Error returning static projects map:", error);
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}
