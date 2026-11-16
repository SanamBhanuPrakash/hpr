import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteMeta } from "../../seo/routesMeta";
import { getOrganizationSchema, getFaqSchema } from "../../seo/schema";

export default function SEO() {
  const { pathname } = useLocation();
  const { title, description, robots, canonical } = getRouteMeta(pathname);
  const isHome = pathname === "/";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {isHome && (
        <>
          <script type="application/ld+json">{JSON.stringify(getOrganizationSchema())}</script>
          <script type="application/ld+json">{JSON.stringify(getFaqSchema())}</script>
        </>
      )}
    </Helmet>
  );
}
