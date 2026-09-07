module.exports = function (eleventyConfig) {
  // Static assets are copied verbatim; there is no asset pipeline on purpose so that
  // a content change stays a one-file pull request.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/root": "." });

  eleventyConfig.addWatchTarget("src/assets");

  // Swiss thousands separator, used for every figure rendered at build time.
  eleventyConfig.addFilter("chf", (value) =>
    new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 }).format(value)
  );

  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString().slice(0, 10));

  // The two language trees mirror each other exactly — German at the root, English under
  // /en/ — so a page's translation is a pure function of its own URL. No page has to
  // declare where its sibling lives, and the pair can never fall out of step.
  eleventyConfig.addFilter("inLanguage", (url, lang) => {
    const rootPath = url.startsWith("/en/") ? url.slice(3) : url;
    return lang === "en" ? "/en" + rootPath : rootPath;
  });

  eleventyConfig.addGlobalData("buildYear", new Date().getFullYear());

  // Absolute URL for the sitemap and for canonical/OpenGraph tags.
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
