"use client"

import Script from "next/script"

const SITE_URL = "https://sohailgidwani.app"

const KNOWN_LANGUAGES = new Set([
  'Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'SQL',
  'Rust', 'Go', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'Shell',
  'Bash', 'HTML', 'CSS', 'SCSS', 'PHP', 'Dart', 'Elixir', 'Haskell',
])

function filterToLanguages(keywords: string[]): string[] {
  return keywords.filter(k => KNOWN_LANGUAGES.has(k))
}

type ProjectType = "app" | "research"

type ProjectDetailStructuredDataProps = {
  title: string
  description: string
  slug: string
  image: string
  keywords: string[]
  github?: string
  dateCreated?: string
  projectType?: ProjectType
}

export default function ProjectDetailStructuredData({
  title,
  description,
  slug,
  image,
  keywords,
  github,
  dateCreated,
  projectType = "app",
}: ProjectDetailStructuredDataProps) {
  const url = `${SITE_URL}/projects/${slug}`
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`

  const baseWork = {
    "name": title,
    "description": description,
    "url": url,
    "image": imageUrl,
    "author": { "@id": `${SITE_URL}/#person` },
    "creator": { "@id": `${SITE_URL}/#person` },
    "publisher": { "@id": `${SITE_URL}/#person` },
    "keywords": keywords,
    "inLanguage": "en",
    "isPartOf": { "@id": `${SITE_URL}/#website` },
    "mainEntityOfPage": { "@id": url },
    ...(dateCreated ? { "dateCreated": dateCreated } : {}),
    ...(github ? { "sameAs": [github] } : {}),
  }

  const typeSpecificNode = projectType === "research"
    ? {
        "@type": "ScholarlyArticle",
        "@id": `${url}#article`,
        ...baseWork,
        "about": keywords.map(k => ({ "@type": "DefinedTerm", "name": k })),
      }
    : {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        ...baseWork,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Cross-platform",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      typeSpecificNode,
      ...(github
        ? [
            {
              "@type": "SoftwareSourceCode",
              "@id": `${url}#source`,
              "name": title,
              "description": description,
              "url": url,
              "codeRepository": github,
              "author": { "@id": `${SITE_URL}/#person` },
              "creator": { "@id": `${SITE_URL}/#person` },
              "publisher": { "@id": `${SITE_URL}/#person` },
              "programmingLanguage": filterToLanguages(keywords),
              "inLanguage": "en",
              "isPartOf": { "@id": `${SITE_URL}/#website` },
              "mainEntityOfPage": { "@id": url },
              ...(dateCreated ? { "dateCreated": dateCreated } : {}),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${SITE_URL}/projects` },
          { "@type": "ListItem", "position": 3, "name": title, "item": url },
        ],
      },
    ],
  }

  return (
    <Script
      id={`project-structured-data-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
