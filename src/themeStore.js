const fs = require("fs/promises");
const path = require("path");

const themePath = path.join(__dirname, "data", "theme.json");

const defaultTheme = {
  accentColor: "#0f766e",
  backgroundStart: "#f0fdfa",
  backgroundEnd: "#ccfbf1",
  fontFamily: "Poppins",
};

const allowedFonts = [
  "Poppins",
  "Montserrat",
  "Merriweather",
  "Nunito Sans",
  "Source Sans 3",
];

function isHexColor(value) {
  return /^#([0-9A-Fa-f]{6})$/.test(value);
}

function validateTheme(theme) {
  const candidate = {
    accentColor: String(theme.accentColor || "").trim(),
    backgroundStart: String(theme.backgroundStart || "").trim(),
    backgroundEnd: String(theme.backgroundEnd || "").trim(),
    fontFamily: String(theme.fontFamily || "").trim(),
  };

  if (!isHexColor(candidate.accentColor)) {
    throw new Error("accentColor harus berupa warna hex, contoh #0f766e");
  }

  if (!isHexColor(candidate.backgroundStart)) {
    throw new Error("backgroundStart harus berupa warna hex");
  }

  if (!isHexColor(candidate.backgroundEnd)) {
    throw new Error("backgroundEnd harus berupa warna hex");
  }

  if (!allowedFonts.includes(candidate.fontFamily)) {
    throw new Error("fontFamily tidak valid");
  }

  return candidate;
}

async function ensureThemeFile() {
  try {
    await fs.access(themePath);
  } catch {
    await fs.mkdir(path.dirname(themePath), { recursive: true });
    await fs.writeFile(themePath, JSON.stringify(defaultTheme, null, 2), "utf8");
  }
}

async function getTheme() {
  await ensureThemeFile();
  const raw = await fs.readFile(themePath, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return validateTheme(parsed);
  } catch {
    return defaultTheme;
  }
}

async function updateTheme(nextTheme) {
  const validated = validateTheme(nextTheme);
  await fs.writeFile(themePath, JSON.stringify(validated, null, 2), "utf8");
  return validated;
}

module.exports = {
  getTheme,
  updateTheme,
  allowedFonts,
};
