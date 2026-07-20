import type { IncomingMessage, ServerResponse } from "node:http";
import { PDFDocument } from "pdf-lib";

const CV_URL = "https://a3s.fi/swift/v1/nayreed/Nayreeds-Resume.pdf";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "CDN-Cache-Control": "no-store",
  Expires: "0",
  Pragma: "no-cache",
  "Surrogate-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
} as const;

type Status =
  | "up-to-date"
  | "newer-available"
  | "unidentified"
  | "failed";

interface StatusDetails {
  status: Status;
  checkedVersion: string;
  checkedTimestamp: number | null;
  currentTimestamp: number | null;
  currentCreationDate: Date | null;
}

/**
 * Convert a PDF date (or an already parsed Date) to whole UTC seconds.
 *
 * PDF timestamps describe local wall-clock time followed by an optional UTC
 * offset. Query parsers commonly turn a literal `+` into a space, so that
 * representation is normalized before parsing as well.
 */
export function normalizePdfTimestamp(
  input: string | Date | null | undefined,
): number | null {
  if (input instanceof Date) {
    const timestamp = input.getTime();
    return Number.isNaN(timestamp) ? null : Math.floor(timestamp / 1000) * 1000;
  }

  if (typeof input !== "string") {
    return null;
  }

  let value = input.trim();
  if (!value) {
    return null;
  }

  // Vercel normally supplies an already decoded query value. Decoding here as
  // well makes the normalizer useful for direct tests and encoded input.
  if (value.includes("%")) {
    try {
      value = decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  // application/x-www-form-urlencoded parsing changes `+03'00'` to
  // ` 03'00'`. Restore only a timezone-looking suffix.
  value = value.replace(
    /^((?:D:)?\d{14})\s+(\d{2}(?:[':]?\d{2})'?)$/i,
    "$1+$2",
  );

  const pdfDate = value.match(
    /^(?:D:)?(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:(Z)|([+-])(\d{2})(?:[':]?)(\d{2})'?)?$/i,
  );

  if (pdfDate) {
    const [, year, month, day, hour, minute, second, , sign, tzHour, tzMinute] =
      pdfDate;
    const parts = [year, month, day, hour, minute, second].map(Number);
    const [yearNumber, monthNumber, dayNumber, hourNumber, minuteNumber, secondNumber] =
      parts;

    const localTimestamp = Date.UTC(
      yearNumber,
      monthNumber - 1,
      dayNumber,
      hourNumber,
      minuteNumber,
      secondNumber,
    );
    const localDate = new Date(localTimestamp);

    // Date.UTC rolls invalid fields into adjacent units, so compare every field
    // with the input to reject malformed dates rather than silently changing it.
    if (
      localDate.getUTCFullYear() !== yearNumber ||
      localDate.getUTCMonth() !== monthNumber - 1 ||
      localDate.getUTCDate() !== dayNumber ||
      localDate.getUTCHours() !== hourNumber ||
      localDate.getUTCMinutes() !== minuteNumber ||
      localDate.getUTCSeconds() !== secondNumber
    ) {
      return null;
    }

    let offsetMinutes = 0;
    if (sign && tzHour && tzMinute) {
      const offsetHours = Number(tzHour);
      const offsetMinutePart = Number(tzMinute);
      if (offsetHours > 23 || offsetMinutePart > 59) {
        return null;
      }

      const absoluteOffset = offsetHours * 60 + offsetMinutePart;
      offsetMinutes = sign === "+" ? absoluteOffset : -absoluteOffset;
    }

    return localTimestamp - offsetMinutes * 60_000;
  }

  // Also accept the canonical ISO value shown on the status page.
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/i.test(value)) {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? null : Math.floor(timestamp / 1000) * 1000;
  }

  return null;
}

function canonicalPdfDate(timestamp: number): string {
  return `D:${new Date(timestamp).toISOString().replace(/[-:.]/g, "").replace("T", "").replace("000Z", "Z")}`;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function renderStatusPage(details: StatusDetails): string {
  const copy = {
    "up-to-date": {
      eyebrow: "Version confirmed",
      title: "This CV is up to date",
      message: "The downloaded CV matches the latest version currently stored in Allas.",
      accent: "#25c2a0",
      accentSoft: "rgba(37, 194, 160, 0.14)",
    },
    "newer-available": {
      eyebrow: "Update available",
      title: "A newer CV is available",
      message: "A CV created after the downloaded copy is now available.",
      accent: "#ffb454",
      accentSoft: "rgba(255, 180, 84, 0.14)",
    },
    unidentified: {
      eyebrow: "Version unavailable",
      title: "The CV version could not be identified",
      message: "The checker link did not contain a recognizable PDF creation timestamp.",
      accent: "#91a4c5",
      accentSoft: "rgba(145, 164, 197, 0.14)",
    },
    failed: {
      eyebrow: "Check unavailable",
      title: "The version check failed",
      message: "The latest CV could not be checked right now. Please try again shortly.",
      accent: "#ff6b81",
      accentSoft: "rgba(255, 107, 129, 0.14)",
    },
  }[details.status];

  const checkedVersion = escapeHtml(details.checkedVersion || "Not provided");
  const normalizedChecked =
    details.checkedTimestamp === null
      ? "Unavailable"
      : new Date(details.checkedTimestamp).toISOString();
  const currentVersion =
    details.currentTimestamp === null
      ? "Unavailable"
      : canonicalPdfDate(details.currentTimestamp);
  const currentCreationDate =
    details.currentCreationDate === null
      ? "Unavailable"
      : details.currentCreationDate.toISOString();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <title>${copy.title}</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; color: #eef3ff; background: radial-gradient(circle at 15% 15%, #17264d 0, transparent 34%), radial-gradient(circle at 85% 85%, #132e38 0, transparent 36%), #080d19; }
      main { width: min(100%, 720px); padding: clamp(24px, 5vw, 48px); border: 1px solid rgba(179, 197, 230, 0.18); border-radius: 24px; background: rgba(12, 20, 37, 0.88); box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4); backdrop-filter: blur(18px); }
      .status { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 18px; padding: 8px 12px; border: 1px solid ${copy.accent}55; border-radius: 999px; color: ${copy.accent}; background: ${copy.accentSoft}; font-size: 0.76rem; font-weight: 750; letter-spacing: 0.09em; text-transform: uppercase; }
      .status::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: ${copy.accent}; box-shadow: 0 0 18px ${copy.accent}; }
      h1 { margin: 0; font-size: clamp(2rem, 7vw, 3.65rem); line-height: 1.02; letter-spacing: -0.05em; }
      .lead { margin: 18px 0 30px; color: #aebbd2; font-size: clamp(1rem, 2.5vw, 1.13rem); line-height: 1.65; }
      dl { display: grid; gap: 1px; margin: 0 0 30px; overflow: hidden; border: 1px solid rgba(179, 197, 230, 0.14); border-radius: 15px; background: rgba(179, 197, 230, 0.14); }
      .row { min-width: 0; padding: 15px 17px; background: #0c1425; }
      dt { margin-bottom: 6px; color: #8292ae; font-size: 0.73rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
      dd { min-width: 0; margin: 0; color: #e2e9f6; font-size: 0.91rem; line-height: 1.5; overflow-wrap: anywhere; }
      dd small { display: block; margin-top: 4px; color: #8292ae; }
      code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 0.88em; }
      a { display: inline-flex; justify-content: center; align-items: center; min-height: 48px; width: 100%; padding: 12px 18px; border-radius: 12px; color: #071019; background: #f2f6ff; font-weight: 800; text-decoration: none; transition: transform 160ms ease, background 160ms ease; }
      a:hover { transform: translateY(-1px); background: #ffffff; }
      a:focus-visible { outline: 3px solid ${copy.accent}; outline-offset: 4px; }
      footer { margin-top: 22px; color: #687997; font-size: 0.76rem; text-align: center; }
      @media (min-width: 580px) { .row { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 18px; align-items: start; } dt { margin: 2px 0 0; } }
      @media (prefers-reduced-motion: reduce) { a { transition: none; } }
    </style>
  </head>
  <body>
    <main>
      <div class="status">${copy.eyebrow}</div>
      <h1>${copy.title}</h1>
      <p class="lead">${copy.message}</p>
      <dl>
        <div class="row">
          <dt>Checked version</dt>
          <dd><code>${checkedVersion}</code><small>Normalized: ${normalizedChecked}</small></dd>
        </div>
        <div class="row">
          <dt>Current version</dt>
          <dd><code>${currentVersion}</code></dd>
        </div>
        <div class="row">
          <dt>Current PDF creation date</dt>
          <dd><code>${currentCreationDate}</code></dd>
        </div>
      </dl>
      <a href="${CV_URL}">Open the latest CV</a>
      <footer>Checked directly against the current Allas PDF.</footer>
    </main>
  </body>
</html>`;
}

async function readCurrentCreationDate(): Promise<Date> {
  const response = await fetch(CV_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/pdf",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Allas returned HTTP ${response.status}`);
  }

  const bytes = await response.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const creationDate = pdf.getCreationDate();

  if (!creationDate || normalizePdfTimestamp(creationDate) === null) {
    throw new Error("The Allas PDF does not contain a valid creation date");
  }

  return creationDate;
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  for (const [header, value] of Object.entries(NO_CACHE_HEADERS)) {
    response.setHeader(header, value);
  }
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  );
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");

  const requestUrl = new URL(
    request.url ?? "/api/cv-status",
    "https://nayreed.vercel.app",
  );
  const checkedVersion = requestUrl.searchParams.get("v")?.trim() ?? "";
  const checkedTimestamp = normalizePdfTimestamp(checkedVersion);

  try {
    const currentCreationDate = await readCurrentCreationDate();
    const currentTimestamp = normalizePdfTimestamp(currentCreationDate);

    if (currentTimestamp === null) {
      throw new Error("The current creation date could not be normalized");
    }

    const status: Status =
      checkedTimestamp === null
        ? "unidentified"
        : checkedTimestamp < currentTimestamp
          ? "newer-available"
          : "up-to-date";

    response.statusCode = checkedTimestamp === null ? 400 : 200;
    response.end(
      renderStatusPage({
        status,
        checkedVersion,
        checkedTimestamp,
        currentTimestamp,
        currentCreationDate,
      }),
    );
  } catch (error) {
    console.error("CV version check failed", error);
    response.statusCode = 502;
    response.end(
      renderStatusPage({
        status: "failed",
        checkedVersion,
        checkedTimestamp,
        currentTimestamp: null,
        currentCreationDate: null,
      }),
    );
  }
}
