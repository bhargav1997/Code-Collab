// Create a SEO component
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

export function SEO({ title, description, image, type = "website", keywords, path, schema }) {
   // Base URL without trailing slash
   const siteUrl = "https://www.trackmyskills.tech/#/";

   // Construct canonical URL properly
   const canonicalUrl = path ? `${siteUrl}${path}` : siteUrl;

   // Ensure image URL is absolute
   const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

   return (
      <Helmet>
         {/* Basic Meta Tags */}
         <title>{title} | LearnHUB</title>
         <meta name='description' content={description} />
         <meta name='keywords' content={keywords} />

         {/* Canonical URL - Important for SEO */}
         <link rel='canonical' href={canonicalUrl} />

         {/* Open Graph Tags */}
         <meta property='og:type' content={type} />
         <meta property='og:title' content={title} />
         <meta property='og:description' content={description} />
         <meta property='og:image' content={fullImageUrl} />
         <meta property='og:url' content={canonicalUrl} />
         <meta property='og:site_name' content='LearnHUB' />

         {/* Twitter Tags */}
         <meta name='twitter:card' content='summary_large_image' />
         <meta name='twitter:title' content={title} />
         <meta name='twitter:description' content={description} />
         <meta name='twitter:image' content={fullImageUrl} />

         {/* Schema.org JSON-LD */}
         {schema && (
            <script type='application/ld+json'>
               {JSON.stringify({
                  ...schema,
                  "@context": "https://schema.org",
                  url: canonicalUrl,
               })}
            </script>
         )}
      </Helmet>
   );
}

SEO.propTypes = {
   title: PropTypes.string.isRequired,
   description: PropTypes.string.isRequired,
   image: PropTypes.string.isRequired,
   type: PropTypes.string,
   keywords: PropTypes.string,
   path: PropTypes.string,
   schema: PropTypes.object,
};
