import Script from 'next/script'

export default function BreadcrumbStructuredData() {
  const breadcrumbData = {
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
      id="breadcrumb-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData)
      }}
    />
  )
}
