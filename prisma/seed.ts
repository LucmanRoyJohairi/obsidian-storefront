import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const product = await prisma.product.create({
    data: {
      title: "Obsidian 4K Wallpaper Pack",
      description: "24 minimalist dark mode abstract wallpapers in 4K resolution.",
      category: "WALLPAPERS",
      priceUsdt: 15.0,
      fileUrl: "https://example.com",
    },
  });

  console.log("Successfully inserted product:", product);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
