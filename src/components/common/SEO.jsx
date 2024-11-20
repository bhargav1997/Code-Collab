// Create a SEO component
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

export function SEO({ title, description, image, type = "website", keywords, path }) {
   const siteUrl = "https://www.trackmyskills.tech";
   const canonicalUrl = path ? `${siteUrl}${path}` : siteUrl;
   const fullImageUrl = image?.startsWith("http") ? image : `${siteUrl}${image}`;

   return (
      <Helmet>
         {/* Essential Meta Tags */}
         <title>{`${title} | LearnHUB - Collaborative Learning Platform`}</title>
         <meta name="description" content={description} />
         <meta name="keywords" content={`learnhub, learning platform, ${keywords}`} />
         <link rel="canonical" href={canonicalUrl} />

         {/* OpenGraph Meta Tags */}
         <meta property="og:type" content={type} />
         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:image" content={fullImageUrl} />
         <meta property="og:url" content={canonicalUrl} />
         <meta property="og:site_name" content="LearnHUB" />

         {/* Twitter Card Tags */}
         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:creator" content="@bsuthar_712" />
         <meta name="twitter:title" content={title} />
         <meta name="twitter:description" content={description} />
         <meta name="twitter:image" content={fullImageUrl} />

         {/* Structured Data - Organization */}
         <script type="application/ld+json">
            {JSON.stringify({
               "@context": "https://schema.org",
               "@type": "Organization",
               "name": "LearnHUB",
               "url": siteUrl,
               "logo": `${siteUrl}/icons/icon-512x512.png`,
               "sameAs": [
                  "https://linkedin.com/in/bhargav-suthar",
                  "https://twitter.com/bsuthar_712",
                  "https://github.com/bhargav1997"
               ],
               "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "hello.learnhub@gmail.com",
                  "contactType": "customer service"
               }
            })}
         </script>

         {/* Structured Data - WebSite */}
         <script type="application/ld+json">
            {JSON.stringify({
               "@context": "https://schema.org",
               "@type": "WebSite",
               "name": "LearnHUB",
               "url": siteUrl,
               "potentialAction": {
                  "@type": "SearchAction",
                  "target": `${siteUrl}/search?q={search_term_string}`,
                  "query-input": "required name=search_term_string"
               }
            })}
         </script>
      </Helmet>
   );
}

SEO.propTypes = {
   title: PropTypes.string.isRequired,
   description: PropTypes.string.isRequired,
   image: PropTypes.string,
   type: PropTypes.string,
   keywords: PropTypes.string,
   path: PropTypes.string,
};
