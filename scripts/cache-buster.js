// scripts/cache-buster.js
hexo.extend.filter.register("after_render:html", function (str, data) {
  if (!str) return str;

  const timestamp = Date.now();

  // 处理CSS资源
  str = str.replace(
    /(<link[^>]*href=["']?)([^"'?]+\.css)(\?[^"']*)?["']/g,
    (match, prefix, url, query) => {
      // 跳过CDN和外部资源
      if (
        url.includes("cdn.") ||
        url.includes("://") ||
        url.startsWith("http")
      ) {
        return match;
      }
      // 避免重复添加版本号
      if (query && query.includes("v=")) {
        return match;
      }
      return `${prefix}${url}?v=${timestamp}"`;
    }
  );

  // 处理JS资源
  str = str.replace(
    /(<script[^>]*src=["']?)([^"'?]+\.js)(\?[^"']*)?["']/g,
    (match, prefix, url, query) => {
      if (
        url.includes("cdn.") ||
        url.includes("://") ||
        url.startsWith("http")
      ) {
        return match;
      }
      if (query && query.includes("v=")) {
        return match;
      }
      return `${prefix}${url}?v=${timestamp}"`;
    }
  );

  return str;
});
