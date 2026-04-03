function requireLogin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/");
}

function requireThemeEditor(req, res, next) {
  if (req.user && req.user.canEditTheme) {
    return next();
  }

  return res.status(403).render("forbidden", {
    title: "Akses Ditolak",
    message:
      "Akun ini berhasil login, tetapi tidak memiliki izin untuk mengubah tampilan website.",
  });
}

module.exports = {
  requireLogin,
  requireThemeEditor,
};
