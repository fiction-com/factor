import { toLabel, setting } from "@factor/tools"
import { renderMarkdown } from "@factor/tools/markdown"
import { DocsItem } from "./types"

export function config(): DocsItem[] {
  return normalize(setting("docs.pages"))
}

export async function getMarkdownHTML(slug: string): Promise<string> {
  const { file } = selected(slug) || {}

  let html = ""

  if (file) {
    const { default: markdown } = await file()
    html = renderMarkdown(markdown)
  }

  return html
}

export function selected(slug: string): DocsItem | void {
  return config().find(_ => (slug ? _.slug == slug : _.root))
}

export function metatags(slug: string): { title?: string; description?: string } {
  const { title, description } = selected(slug) || {}

  return { title, description }
}

export function normalize(items: DocsItem[]): DocsItem[] {
  return items.map(options => {
    const { slug, name, root } = options

    if (!root && !slug) return options

    const route = `/${setting("docs.base")}/${root ? "" : slug}`

    const d = {
      slug,
      route,
      name: name || toLabel(slug),
      title: name || toLabel(slug),
      description: "",
      file: (): Promise<{ default: string }> => import(`../docs/${slug}.md`)
    }

    return { ...d, ...options }
  })
}
