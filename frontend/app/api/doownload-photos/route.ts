import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// One-time photo downloader — runs inside Next.js (which HAS internet)
// Visit: http://localhost:3000/api/download-photos
// Watch the terminal for progress. Takes ~5-8 minutes for 508 photos.
// After done, mp_photos.json will have local /mp_photos/... paths.

const PHOTOS_DIR = path.join(process.cwd(), "public", "mp_photos");
const JSON_PATH  = path.join(process.cwd(), "public", "mp_photos.json");

function safeName(name: string): string {
  return name.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") + ".jpg";
}

async function downloadOne(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://en.wikipedia.org/",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    if (!res.ok) return false;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 1500) return false;
    fs.writeFileSync(dest, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

export async function GET() {
  // Create photos dir
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  // Load JSON
  if (!fs.existsSync(JSON_PATH)) {
    return NextResponse.json({ error: "mp_photos.json not found in public/" }, { status: 404 });
  }

  const photos: Record<string, string> = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
  const names = Object.keys(photos);
  const updated = { ...photos };

  let ok = 0, skip = 0, fail = 0;
  const results: string[] = [];

  console.log(`\n🚀 Starting photo download for ${names.length} MPs...\n`);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const url  = photos[name];

    if (!url || !url.startsWith("http")) {
      skip++;
      continue;
    }

    const fname = safeName(name);
    const dest  = path.join(PHOTOS_DIR, fname);
    const local = `/mp_photos/${fname}`;

    // Already downloaded?
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1500) {
      updated[name] = local;
      skip++;
      continue;
    }

    const success = await downloadOne(url, dest);

    if (success) {
      updated[name] = local;
      ok++;
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`  [${i+1}/${names.length}] ✅ ${name} (${kb}KB)`);
      results.push(`✅ ${name}`);
    } else {
      fail++;
      console.log(`  [${i+1}/${names.length}] ❌ ${name}`);
      results.push(`❌ ${name}`);
    }

    // Save progress every 25 MPs
    if ((i + 1) % 25 === 0) {
      fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2));
      console.log(`  💾 Progress saved (${ok}✅ ${skip}⏭ ${fail}❌)`);
    }

    await sleep(300); // 300ms between downloads
  }

  // Final save
  fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2));

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Done! ${ok} downloaded, ${skip} skipped, ${fail} failed`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  return NextResponse.json({
    message: "Done!",
    downloaded: ok,
    skipped: skip,
    failed: fail,
    total: names.length,
    results: results.slice(0, 50), // first 50 in response
  });
}