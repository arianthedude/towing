import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
import { buildPageMetadata, getSiteUrl, serializeJsonLd } from "../src/lib/seo";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";

test("runtime deployment origin controls metadata, sitemap and robots", () => {
  const previousSite = process.env.SITE_URL;
  const previousLegacy = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.SITE_URL = "https://towing.example/";
    assert.equal(getSiteUrl(), "https://towing.example");
    for (const locale of ["fa", "en"] as const) {
      for (const path of ["/", "/services", "/contact"]) {
        const canonical = `https://towing.example${locale === "en" ? "/en" : ""}${path === "/" && locale === "en" ? "" : path}`;
        const metadata = buildPageMetadata({ locale, path, title: "Roadside help", description: "Help for your vehicle", businessName: "Test business", imageAlt: "Tow truck" });
        assert.equal(metadata.alternates?.canonical, canonical);
        assert.equal(metadata.alternates?.languages?.["x-default"], `https://towing.example${path}`);
        assert.ok(JSON.stringify(metadata.openGraph).includes(canonical));
        assert.ok(JSON.stringify(metadata.twitter).includes("https://towing.example/images/towing-editorial.webp"));
      }
    }
    const entries = sitemap();
    assert.equal(entries.length, 6);
    assert.equal(new Set(entries.map(entry => entry.url)).size, 6);
    assert.ok(entries.every(entry => entry.url.startsWith(getSiteUrl()) && !entry.url.includes("/admin") && !entry.lastModified));
    assert.equal(robots().sitemap, "https://towing.example/sitemap.xml");

    process.env.SITE_URL = "https://new-domain.example";
    assert.ok(sitemap().every(entry => entry.url.startsWith("https://new-domain.example")));

    for (const invalid of ["javascript:alert(1)", "https://user:pass@example.com", "https://example.com/path", "https://example.com/?q=x", "https://example.com/#fragment"]) {
      process.env.SITE_URL = invalid;
      assert.throws(getSiteUrl);
    }
    delete process.env.SITE_URL;
    assert.equal(getSiteUrl(), "http://localhost:3000");
  } finally {
    if (previousSite === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previousSite;
    if (previousLegacy === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousLegacy;
  }
});

test("editable business copy cannot escape a JSON-LD script", () => {
  const data = { name: '</script><script>alert("x")</script>', description: "امداد خودرو & towing" };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});

test("canonical URLs keep their language regardless of cookies", () => {
  for (const path of ["/", "/services", "/contact", "/admin/login"]) {
    const response = proxy(new NextRequest(`https://towing.example${path}`, { headers: { cookie: "NEXT_LOCALE=en" } }));
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("x-middleware-rewrite"), `https://towing.example/fa${path === "/" ? "" : path}`);
  }
  const english = proxy(new NextRequest("https://towing.example/en/services", { headers: { cookie: "NEXT_LOCALE=fa" } }));
  assert.equal(english.headers.get("location"), null);
  assert.equal(english.headers.get("x-middleware-rewrite"), null);

  const legacy = proxy(new NextRequest("https://towing.example/fa/services?source=test"));
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get("location"), "https://towing.example/services?source=test");

  for (const path of ["/robots.txt", "/sitemap.xml", "/images/towing-editorial.webp", "/api/health"]) {
    const response = proxy(new NextRequest(`https://towing.example${path}`));
    assert.equal(response.headers.get("x-middleware-rewrite"), null);
    assert.equal(response.headers.get("location"), null);
  }
});
