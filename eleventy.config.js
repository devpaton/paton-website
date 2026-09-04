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
