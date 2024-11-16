// Create a SEO component
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

export function SEO({ title, description, image, type = "website", keywords, canonicalUrl, schema }) {
   const siteUrl = "https://www.trackmyskills.tech";
   const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

   return (
      <Helmet>
         {/* Basic Meta Tags */}
         <title>{title} | LearnHUB</title>
         <meta name='description' content={description} />
         <meta name='keywords' content={keywords} />
         <link rel='canonical' href={fullUrl} />

         {/* Open Graph Tags */}
         <meta property='og:type' content={type} />
         <meta property='og:title' content={title} />
         <meta property='og:description' content={description} />
         <meta property='og:image' content={image} />
         <meta property='og:url' content={fullUrl} />
         <meta property='og:site_name' content='LearnHUB' />

         {/* Twitter Tags */}
         <meta name='twitter:card' content='summary_large_image' />
         <meta name='twitter:title' content={title} />
         <meta name='twitter:description' content={description} />
         <meta name='twitter:image' content={image} />

         {/* Schema.org JSON-LD */}
         {schema && <script type='application/ld+json'>{JSON.stringify(schema)}</script>}
      </Helmet>
   );
}

SEO.propTypes = {
   title: PropTypes.string.isRequired,
   description: PropTypes.string.isRequired,
   image: PropTypes.string.isRequired,
   type: PropTypes.string,
   keywords: PropTypes.string,
   canonicalUrl: PropTypes.string,
   schema: PropTypes.object,
};
