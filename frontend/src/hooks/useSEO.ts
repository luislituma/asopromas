import { useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  schema?: string; // For custom schema.org data
}

export const useSEO = ({
  title,
  description,
  keywords,
  image = '/assets/images/og-default.jpg',
  url,
  type = 'website',
  siteName = 'ASOPROMAS - Cacao Premium del Ecuador',
  schema
}: SEOData) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    updateMetaTag('description', description);

    // Keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph
    updateMetaProperty('og:title', title);
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', `${window.location.origin}${image}`);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:site_name', siteName);
    
    if (url) {
      updateMetaProperty('og:url', `${window.location.origin}${url}`);
    }

    // Twitter Cards
    updateMetaProperty('twitter:card', 'summary_large_image');
    updateMetaProperty('twitter:title', title);
    updateMetaProperty('twitter:description', description);
    updateMetaProperty('twitter:image', `${window.location.origin}${image}`);

    // Canonical URL
    if (url) {
      updateCanonicalUrl(`${window.location.origin}${url}`);
    }

    // Schema.org structured data
    if (schema) {
      insertCustomSchema(schema);
    }
  }, [title, description, keywords, image, url, type, siteName, schema]);
};

const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateCanonicalUrl = (url: string) => {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  
  element.href = url;
};

const insertCustomSchema = (schema: string) => {
  // Remove existing custom schema
  const existingSchema = document.querySelector('script[data-schema="custom"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema', 'custom');
  script.textContent = schema;
  document.head.appendChild(script);
};