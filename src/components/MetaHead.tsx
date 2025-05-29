import { Helmet } from 'react-helmet-async';

interface MetaHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const MetaHead: React.FC<MetaHeadProps> = ({
  title = "AI Cube – Learn AI Through Play",
  description = "A simulation-based learning platform that teaches kids cognitive skills for the AI era.",
  image = "https://aicube.ai/og-image.png",
  url = "https://aicube.ai",
}) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": title, // Use the title prop
    "description": description, // Use the description prop
    "brand": {
      "@type": "Brand",
      "name": "AIME Intelligence"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    },
    "image": image,
    "url": url,
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default MetaHead;