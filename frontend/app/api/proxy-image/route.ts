import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "mp_photos");
const JSON_PATH = path.join(process.cwd(), "public", "mp_photos.json");

function safeName(name: string): string {
  return name.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_") + ".jpg";
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadOne(url: string, dest: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer": "https://en.wikipedia.org/",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) return false;

    const buffer = await res.arrayBuffer();

    if (buffer.byteLength < 1500) return false;

    fs.writeFileSync(dest, Buffer.from(buffer));

    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  if (!fs.existsSync(JSON_PATH)) {
    return NextResponse.json(
      { error: "mp_photos.json not found in public folder" },
      { status: 404 }
    );
  }

  const photos: Record<string, string> = JSON.parse(
    fs.readFileSync(JSON_PATH, "utf-8")
  );

  const names = Object.keys(photos);
  const updated = { ...photos };

  let ok = 0;
  let skip = 0;
  let fail = 0;

  console.log(`\n🚀 Downloading ${names.length} MP photos...\n`);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const url = photos[name];

    if (!url || !url.startsWith("http")) {
      skip++;
      continue;
    }

    const fname = safeName(name);
    const dest = path.join(PHOTOS_DIR, fname);
    const local = `/mp_photos/${fname}`;

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1500) {
      updated[name] = local;
      skip++;
      continue;
    }

    let success = await downloadOne(url, dest);

    if (!success) {
      await sleep(800);
      success = await downloadOne(url, dest);
    }

    if (!success) {
      await sleep(1200);
      success = await downloadOne(url, dest);
    }

    const percent = Math.round(((i + 1) / names.length) * 100);

    if (success) {
      updated[name] = local;
      ok++;
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`[${i + 1}/${names.length}] ${percent}% ✅ ${name} (${kb}KB)`);
    } else {
      fail++;
      console.log(`[${i + 1}/${names.length}] ${percent}% ❌ ${name}`);
    }

    if ((i + 1) % 25 === 0) {
      fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2));
      console.log(`💾 Progress saved`);
    }

    await sleep(150);
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2));

  console.log(`\n✅ Done! ${ok} downloaded, ${skip} skipped, ${fail} failed\n`);

  return NextResponse.json({
    message: "Download complete",
    downloaded: ok,
    skipped: skip,
    failed: fail,
    total: names.length,
  });
}