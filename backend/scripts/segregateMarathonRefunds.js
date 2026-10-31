import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createWorker } from "tesseract.js";
import Marathon from "../models/Marathon.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/zenith26";
const OUTPUT_DIR = path.join(__dirname, "output");
const OCR_CONCURRENCY = Number(process.env.MARATHON_OCR_CONCURRENCY || 3);

const ACCOUNT_RULES = [
  {
    key: "sagar",
    label: "Sagar Ubale",
    highConfidencePatterns: ["sagarubale2004@oksbi"],
    mediumConfidencePatterns: ["sagar ubale", "ubale"],
  },
  {
    key: "balaji",
    label: "Balaji Anil Kalyankar",
    highConfidencePatterns: ["balajianil.kalyankar@ybl"],
    mediumConfidencePatterns: ["balaji anil kalyankar", "balaji kalyankar", "kalyankar"],
  },
  {
    key: "atharva",
    label: "Atharva Joshi",
    highConfidencePatterns: ["atharvsjoshi2005-1@okicici"],
    mediumConfidencePatterns: ["atharva joshi", "atharva", "joshi"],
  },
];

const ACCOUNT_EXPORT_ORDER = ["sagar", "balaji", "atharva", "unknown"];

const ACCOUNT_SECTION_LABELS = {
  sagar: "Sagar Ubale",
  balaji: "Balaji Anil Kalyankar",
  atharva: "Atharva Joshi",
  unknown: "Unknown / Manual Review",
};

function normalizeText(input) {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^a-z0-9@._\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTransactionId(text) {
  const rules = [
    /(?:utr|rrn|txn\s*id|transaction\s*id|upi\s*ref(?:erence)?)\s*[:#-]?\s*([a-z0-9\-]{8,30})/i,
    /\b\d{12}\b/,
    /\b[a-z]{2}\d{10,16}\b/i,
  ];

  for (const rule of rules) {
    const match = text.match(rule);
    if (match) return (match[1] || match[0] || "").trim();
  }

  return "";
}

function classifyAccount(rawText) {
  const text = normalizeText(rawText);
  const hits = [];

  for (const account of ACCOUNT_RULES) {
    for (const pattern of account.highConfidencePatterns) {
      if (text.includes(pattern)) {
        hits.push({
          accountKey: account.key,
          accountLabel: account.label,
          pattern,
          confidence: "high",
        });
      }
    }

    if (!hits.some((h) => h.accountKey === account.key)) {
      for (const pattern of account.mediumConfidencePatterns) {
        if (text.includes(pattern)) {
          hits.push({
            accountKey: account.key,
            accountLabel: account.label,
            pattern,
            confidence: "medium",
          });
          break;
        }
      }
    }
  }

  const uniqueAccounts = [...new Set(hits.map((h) => h.accountKey))];

  if (uniqueAccounts.length === 1) {
    const bestHit = hits.find((h) => h.accountKey === uniqueAccounts[0]);
    return {
      detectedAccount: bestHit.accountLabel,
      detectedKey: bestHit.accountKey,
      confidence: bestHit.confidence,
      matchedPattern: bestHit.pattern,
      status: "classified",
    };
  }

  if (uniqueAccounts.length > 1) {
    return {
      detectedAccount: "UNKNOWN",
      detectedKey: "unknown",
      confidence: "low",
      matchedPattern: hits.map((h) => `${h.accountLabel}:${h.pattern}`).join(" | "),
      status: "ambiguous",
    };
  }

  return {
    detectedAccount: "UNKNOWN",
    detectedKey: "unknown",
    confidence: "low",
    matchedPattern: "",
    status: "unmatched",
  };
}

async function extractTextFromImage(url) {
  const worker = await createWorker("eng");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Image fetch failed: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const result = await worker.recognize(Buffer.from(arrayBuffer));
    return result.data.text || "";
  } finally {
    await worker.terminate();
  }
}

function buildPdfFirstPageImageUrl(url) {
  if (!url) return "";
  // Cloudinary PDF conversion to image (first page) for OCR fallback.
  // Example: /raw/upload/.../file.pdf -> /image/upload/pg_1,f_jpg/.../file.pdf
  return url.replace("/raw/upload/", "/image/upload/pg_1,f_jpg/");
}

async function extractText(url) {
  const isPdf = /\.pdf($|\?)/i.test(url) || /\/raw\/upload\//i.test(url);

  if (isPdf) {
    const pdfAsImageUrl = buildPdfFirstPageImageUrl(url);
    try {
      const text = await extractTextFromImage(pdfAsImageUrl);
      if (normalizeText(text).length > 5) {
        return {
          text,
          source: "pdf-page1-ocr",
          transformedUrl: pdfAsImageUrl,
        };
      }
    } catch (error) {
      return {
        text: "",
        source: "pdf-ocr-error",
        error: error.message,
        transformedUrl: pdfAsImageUrl,
      };
    }

    return {
      text: "",
      source: "pdf-manual-review",
      error: "PDF screenshot requires manual review",
      transformedUrl: pdfAsImageUrl,
    };
  }

  try {
    const text = await extractTextFromImage(url);
    return { text, source: "image-ocr" };
  } catch (error) {
    return { text: "", source: "image-error", error: error.message };
  }
}

function escapeCsv(value) {
  const str = value === undefined || value === null ? "" : String(value);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h])).join(","));
  }

  return lines.join("\n");
}

async function withConcurrency(items, limit, task) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await task(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  const registrations = await Marathon.find({
    "paymentDetails.paymentScreenshot": { $exists: true, $ne: "" },
  })
    .select("registrationNumber fullName email phone status paymentDetails createdAt")
    .lean();

  if (!registrations.length) {
    console.log("No marathon payment screenshots found.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${registrations.length} registrations with screenshots.`);

  const analyzed = await withConcurrency(registrations, OCR_CONCURRENCY, async (registration, i) => {
    const screenshotUrl = registration.paymentDetails?.paymentScreenshot || "";
    const amount = registration.paymentDetails?.amount ?? 99;

    process.stdout.write(`\rProcessing ${i + 1}/${registrations.length}...`);

    const extracted = await extractText(screenshotUrl);
    const classification = classifyAccount(extracted.text);
    const transactionId = getTransactionId(extracted.text || "");

    return {
      registrationNumber: registration.registrationNumber || "",
      fullName: registration.fullName || "",
      email: registration.email || "",
      phone: registration.phone || "",
      status: registration.status || "",
      amount,
      screenshotUrl,
      detectedAccount: classification.detectedAccount,
      detectedKey: classification.detectedKey,
      confidence: classification.confidence,
      classifyStatus: classification.status,
      matchedPattern: classification.matchedPattern,
      transactionId,
      ocrSource: extracted.source,
      ocrError: extracted.error || "",
      ocrTransformedUrl: extracted.transformedUrl || "",
      createdAt: registration.createdAt ? new Date(registration.createdAt).toISOString() : "",
    };
  });

  process.stdout.write("\n");

  const summary = {
    total: analyzed.length,
    sagar: analyzed.filter((r) => r.detectedKey === "sagar").length,
    balaji: analyzed.filter((r) => r.detectedKey === "balaji").length,
    atharva: analyzed.filter((r) => r.detectedKey === "atharva").length,
    unknown: analyzed.filter((r) => r.detectedKey === "unknown").length,
    highConfidence: analyzed.filter((r) => r.confidence === "high").length,
    mediumConfidence: analyzed.filter((r) => r.confidence === "medium").length,
    lowConfidence: analyzed.filter((r) => r.confidence === "low").length,
    ambiguous: analyzed.filter((r) => r.classifyStatus === "ambiguous").length,
  };

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const csvPath = path.join(OUTPUT_DIR, `marathon-refund-segregation-${stamp}.csv`);
  const summaryPath = path.join(OUTPUT_DIR, `marathon-refund-summary-${stamp}.json`);
  const sectionedParticipantsCsvPath = path.join(
    OUTPUT_DIR,
    `marathon-refund-participants-sectioned-${stamp}.csv`
  );
  const refundReadyCsvPath = path.join(
    OUTPUT_DIR,
    `marathon-refund-ready-${stamp}.csv`
  );

  fs.writeFileSync(csvPath, toCsv(analyzed), "utf8");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");

  const sectionedRows = [];
  for (const accountKey of ACCOUNT_EXPORT_ORDER) {
    const rowsForAccount = analyzed
      .filter((r) => r.detectedKey === accountKey)
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    for (const row of rowsForAccount) {
      sectionedRows.push({
        section: ACCOUNT_SECTION_LABELS[accountKey],
        fullName: row.fullName,
        mobileNumber: row.phone,
        registrationNumber: row.registrationNumber,
        amount: row.amount,
        confidence: row.confidence,
        screenshotUrl: row.screenshotUrl,
      });
    }

    // Also create dedicated per-account participant CSV files.
    const accountCsvPath = path.join(
      OUTPUT_DIR,
      `marathon-refund-participants-${accountKey}-${stamp}.csv`
    );

    const accountRows = rowsForAccount.map((row) => ({
      fullName: row.fullName,
      mobileNumber: row.phone,
      registrationNumber: row.registrationNumber,
      amount: row.amount,
      confidence: row.confidence,
      screenshotUrl: row.screenshotUrl,
    }));

    fs.writeFileSync(accountCsvPath, toCsv(accountRows), "utf8");
  }

  fs.writeFileSync(sectionedParticipantsCsvPath, toCsv(sectionedRows), "utf8");

  const refundReadyRows = analyzed
    .map((row) => ({
      fullName: row.fullName,
      mobileNumber: row.phone,
      amount: row.amount,
      account: row.detectedAccount,
      confidence: row.confidence,
      transactionId: row.transactionId,
      registrationNumber: row.registrationNumber,
      screenshotUrl: row.screenshotUrl,
      refund_status: "",
      refund_reference: "",
      notes: row.detectedKey === "unknown" ? "manual review required" : "",
    }))
    .sort((a, b) => a.account.localeCompare(b.account) || a.fullName.localeCompare(b.fullName));

  fs.writeFileSync(refundReadyCsvPath, toCsv(refundReadyRows), "utf8");

  console.log("\nRefund Segregation Summary:");
  console.log(`Total screenshots : ${summary.total}`);
  console.log(`Sagar            : ${summary.sagar}`);
  console.log(`Balaji           : ${summary.balaji}`);
  console.log(`Atharva          : ${summary.atharva}`);
  console.log(`Unknown          : ${summary.unknown}`);
  console.log(`High confidence  : ${summary.highConfidence}`);
  console.log(`Medium confidence: ${summary.mediumConfidence}`);
  console.log(`Low confidence   : ${summary.lowConfidence}`);
  console.log(`Ambiguous        : ${summary.ambiguous}`);

  console.log(`\nDetailed CSV: ${csvPath}`);
  console.log(`Summary JSON: ${summaryPath}`);
  console.log(`Sectioned Participants CSV: ${sectionedParticipantsCsvPath}`);
  console.log(`Refund Ready CSV: ${refundReadyCsvPath}`);
  console.log(`Per-account participant CSVs saved in: ${OUTPUT_DIR}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

main().catch(async (error) => {
  console.error("Script failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
