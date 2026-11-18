import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  // Clear existing seed products so re-running doesn't create duplicates
  await prisma.product.deleteMany();

  const products = await prisma.product.createMany({
    data: [
      {
        title: "Obsidian 4K Wallpaper Pack",
        description: "24 minimalist dark-mode abstract wallpapers in 4K & 6K resolution for desktop and mobile.",
        category: "Wallpapers",
        priceUsdt: 15.0,
        fileUrl: "https://example.com",
      },
      {
        title: "Nocturne Lightroom Presets",
        description: "18 moody, high-contrast color grading presets (.XMP & .DNG) crafted for street and night photography.",
        category: "Presets",
        priceUsdt: 24.0,
        fileUrl: "https://example.com",
      },
      {
        title: "Sub-Zero Synth & Foley Kit",
        description: "120+ royalty-free dark ambient textures, analog bass hits, and UI sound effects in 24-bit WAV.",
        category: "Audio",
        priceUsdt: 29.0,
        fileUrl: "https://example.com",
      },
      {
        title: "Monolith Dark UI Design System",
        description: "Complete Figma component library and Tailwind v4 token kit for sleek developer dashboards.",
        category: "UI Kits",
        priceUsdt: 39.0,
        fileUrl: "https://example.com",
      },
    ],
  });

  console.log(`Successfully seeded ${products.count} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
