import PageNav from "./PageNav"

/** Top bar for the project pages. On the /projects index, "All projects" is
 *  the current page rather than a link to itself. */
export default function ProjectNav({ index = false }: { index?: boolean }) {
  return (
    <PageNav
      items={[
        { label: "Portfolio", icon: "home", href: "/#projects" },
        { label: "All projects", icon: "projects", href: index ? undefined : "/projects" },
      ]}
    />
  )
}
