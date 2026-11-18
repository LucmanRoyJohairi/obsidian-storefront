export interface Product {
  id: string;
  title: string;
  category: string;
  priceUsdt: number;
  description: string;
  badge?: string;
  deliveryPreview: string;
  steps: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "obsidian-wallpapers",
    title: "Obsidian 4K Wallpaper Pack",
    category: "Wallpapers",
    priceUsdt: 5,
    description: "24 ultra-sharp OLED dark abstract wallpapers designed for desktop and ultrawide monitors.",
    badge: "Popular",
    deliveryPreview: "obsidian-4k-pack-v2.zip (412 MB)",
    steps: [
      "Download the ZIP archive using your private link.",
      "Extract the folder and select your monitor resolution (16:9 or 21:9).",
      "Apply via system display settings for true OLED black levels.",
    ],
  },
  {
    id: "noir-luts",
    title: "Noir Cinema LUTs Vol. 1",
    category: "Presets",
    priceUsdt: 12,
    description: "15 moody color-grading LUTs (.cube) compatible with Premiere Pro, DaVinci Resolve, and Final Cut.",
    badge: "New",
    deliveryPreview: "noir-cinema-luts-2026.zip (88 MB)",
    steps: [
      "Unzip the package to locate the .cube files.",
      "Import into your editor's LUT directory or Lumetri Color panel.",
      "Adjust intensity between 40% and 75% for natural skin tones.",
    ],
  },
  {
    id: "tactile-switches",
    title: "Mechanical Switch Sound Kit",
    category: "Audio",
    priceUsdt: 8,
    description: "120+ studio-recorded linear and tactile keystroke WAV samples for UI designers and editors.",
    deliveryPreview: "tactile-switch-wav-pack.zip (145 MB)",
    steps: [
      "Extract the 24-bit WAV audio folders.",
      "Drag dry or room-mic samples directly into your DAW or video timeline.",
      "Use included loop markers for continuous typing ambience.",
    ],
  },
  {
    id: "minimal-icons",
    title: "Monochrome Line Icon Set",
    category: "UI Kits",
    priceUsdt: 10,
    description: "400+ pixel-aligned 1.5px stroke SVG icons crafted for dark-mode web apps and dashboards.",
    deliveryPreview: "monochrome-icons-figma-svg.zip (34 MB)",
    steps: [
      "Open the included .fig file in Figma or browse raw SVGs.",
      "Copy any icon directly as clean JSX or SVG code.",
      "Customize stroke width via CSS currentColor.",
    ],
  },
];
