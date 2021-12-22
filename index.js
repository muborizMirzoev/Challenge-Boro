const browserSync = require('browser-sync');

browserSync({
   server: "app",
   files: ["app/*.html", "app/css/*.css", "app/js/*.js"]
});
