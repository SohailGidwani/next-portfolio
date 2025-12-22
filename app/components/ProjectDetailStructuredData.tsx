"use client"

import Script from "next/script"

const SITE_URL = "https://sohailgidwani.app"

type ProjectDetailStructuredDataProps = {
  title: string
  description: string
  slug: string
  image: string
  keywords: string[]
  github?: string
  dateCreated?: string
}

export default function ProjectDetailStructuredData({
  title,
  description,
  slug,
  image,
  keywords,
  github,
  dateCreated,
}: ProjectDetailStructuredDataProps) {
  const url = `${SITE_URL}/projects/${slug}`
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#creativework`,
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
      },
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
              "programmingLanguage": keywords,
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
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Projects",
            "item": `${SITE_URL}/projects`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": url,
          },
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
