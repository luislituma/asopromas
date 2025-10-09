interface ProductSchemaProps {
  name: string;
  description: string;
  price?: string;
  currency?: string;
  brand?: string;
  category?: string;
  image?: string;
  url?: string;
}

export const generateProductSchema = ({
  name,
  description,
  price,
  currency = 'USD',
  brand = 'KUJEÑITO',
  category = 'Chocolate',
  image,
  url
}: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "manufacturer": {
      "@type": "Organization",
      "name": "ASOPROMAS",
      "url": "https://asopromas.com"
    },
    ...(image && {
      "image": `https://asopromas.com${image}`
    }),
    ...(url && {
      "url": `https://asopromas.com${url}`
    }),
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "ASOPROMAS"
        }
      }
    })
  };

  return JSON.stringify(schema, null, 2);
};

export const insertProductSchema = (schema: string) => {
  // Remove existing product schema
  const existingSchema = document.querySelector('script[data-schema="product"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema', 'product');
  script.textContent = schema;
  document.head.appendChild(script);
};