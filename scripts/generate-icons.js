import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Brand SVG with elegant, modern TAWZOON NEXUS emblem
const regularSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="104" fill="#0F172A"/>
  <circle cx="256" cy="256" r="180" stroke="#334155" stroke-width="4" stroke-dasharray="12 8" opacity="0.6"/>
  <!-- Central Nexus Diamond -->
  <path d="M256 128 L352 256 L256 384 L160 256 Z" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linejoin="round"/>
  <path d="M256 160 L328 256 L256 352 L184 256 Z" fill="#1E293B"/>
  <!-- Bold 'TN' Monogram -->
  <text x="256" y="278" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-weight="900" font-size="88" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">TN</text>
  <text x="256" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-weight="700" font-size="28" fill="#94A3B8" text-anchor="middle" letter-spacing="8">TAWZOON</text>
  <circle cx="256" cy="128" r="10" fill="#38BDF8"/>
  <circle cx="352" cy="256" r="10" fill="#38BDF8"/>
  <circle cx="256" cy="384" r="10" fill="#38BDF8"/>
  <circle cx="160" cy="256" r="10" fill="#38BDF8"/>
</svg>
`;

// Maskable version with safe zone (central 80% circle, 15% margin around all sides)
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0F172A"/>
  <circle cx="256" cy="256" r="150" stroke="#334155" stroke-width="4" opacity="0.6"/>
  <!-- Central Nexus Diamond Scaled for safe zone -->
  <path d="M256 150 L336 256 L256 362 L176 256 Z" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linejoin="round"/>
  <path d="M256 176 L316 256 L256 336 L196 256 Z" fill="#1E293B"/>
  <!-- 'TN' Monogram -->
  <text x="256" y="274" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-weight="900" font-size="76" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">TN</text>
  <text x="256" y="390" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-weight="700" font-size="22" fill="#94A3B8" text-anchor="middle" letter-spacing="6">TAWZOON</text>
  <circle cx="256" cy="150" r="8" fill="#38BDF8"/>
  <circle cx="336" cy="256" r="8" fill="#38BDF8"/>
  <circle cx="256" cy="362" r="8" fill="#38BDF8"/>
  <circle cx="176" cy="256" r="8" fill="#38BDF8"/>
</svg>
`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), regularSvg.trim());

  // 192x192
  await sharp(Buffer.from(regularSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512
  await sharp(Buffer.from(regularSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 512x512 Maskable
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // 180x180 Apple Touch Icon
  await sharp(Buffer.from(regularSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 48x48 Favicon PNG
  await sharp(Buffer.from(regularSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created favicon.png');
}

generate().catch(console.error);
