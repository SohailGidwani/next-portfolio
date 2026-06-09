import Script from 'next/script'

const SITE_URL = 'https://sohailgidwani.app'

type Crumb = {
  name: string
  /** Path relative to the site root, e.g. "/projects". Absolute URLs pass through unchanged. */
  item: string
}

type BreadcrumbStructuredDataProps = {
  /** Trail for the current page, excluding Home (added automatically). */
  items?: Crumb[]
  /** Unique script id when multiple breadcrumb scripts could coexist. */
  id?: string
}

export default function BreadcrumbStructuredData({ items, id }: BreadcrumbStructuredDataProps) {
  const breadcrumbData = items
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          ...items.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": crumb.name,
            "item": crumb.item.startsWith('http') ? crumb.item : `${SITE_URL}${crumb.item}`,
          })),
        ],
      }
    : {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sohailgidwani.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": "https://sohailgidwani.app/#about"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Experience",
        "item": "https://sohailgidwani.app/#experience"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Education",
        "item": "https://sohailgidwani.app/#education"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Skills",
        "item": "https://sohailgidwani.app/#skills"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Projects",
        "item": "https://sohailgidwani.app/#projects"
      },
      {
        "@type": "ListItem",
        "position": 7,
        "name": "Triumphs",
        "item": "https://sohailgidwani.app/#triumphs"
      },
      {
        "@type": "ListItem",
        "position": 8,
        "name": "Personal",
        "item": "https://sohailgidwani.app/#personal"
      },
      {
        "@type": "ListItem",
        "position": 9,
        "name": "Contact",
        "item": "https://sohailgidwani.app/#contact"
      }
    ]
  }

  return (
    <Script
      id={id ?? "breadcrumb-structured-data"}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData)
      }}
    />
  )
}
