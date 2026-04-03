const path = require("path");
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const csrf = require("csurf");

const config = require("./config");
const { getTheme, updateTheme, allowedFonts } = require("./themeStore");
const { requireLogin, requireThemeEditor } = require("./middleware/authz");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.isProduction,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackUrl,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const normalizedEmail = email ? email.toLowerCase() : "";

      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email,
        canEditTheme: config.authorizedEmails.includes(normalizedEmail),
      };

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/", async (req, res, next) => {
  try {
    const theme = await getTheme();
    return res.render("index", {
      title: "Biodata Kelompok",
      theme,
      canEditTheme: Boolean(req.user && req.user.canEditTheme),
    });
  } catch (error) {
    return next(error);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.redirect("/");
    });
  });
});

app.get("/theme/edit", requireLogin, requireThemeEditor, async (req, res, next) => {
  try {
    const theme = await getTheme();
    return res.render("theme-editor", {
      title: "Ubah Tampilan",
      theme,
      allowedFonts,
      error: null,
      success: null,
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/theme/edit", requireLogin, requireThemeEditor, async (req, res, next) => {
  const payload = {
    accentColor: req.body.accentColor,
    backgroundStart: req.body.backgroundStart,
    backgroundEnd: req.body.backgroundEnd,
    fontFamily: req.body.fontFamily,
  };

  try {
    const updatedTheme = await updateTheme(payload);
    return res.render("theme-editor", {
      title: "Ubah Tampilan",
      theme: updatedTheme,
      allowedFonts,
      error: null,
      success: "Tampilan website berhasil diperbarui.",
    });
  } catch (error) {
    return res.status(400).render("theme-editor", {
      title: "Ubah Tampilan",
      theme: payload,
      allowedFonts,
      error: error.message || "Data tema tidak valid.",
      success: null,
    });
  }
});

app.use((error, req, res, next) => {
  if (error.code === "EBADCSRFTOKEN") {
    return res.status(403).send("Form tidak valid. Muat ulang halaman lalu coba lagi.");
  }

  console.error(error);
  return res.status(500).send("Terjadi kesalahan pada server.");
});

app.listen(config.port, () => {
  console.log(`Server berjalan di http://localhost:${config.port}`);
});
