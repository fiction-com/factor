import { slugify, dotSetting } from "@factor/tools/utils"
import { getStoreState } from "@factor/app/store"
import MarkdownIt from "markdown-it"
import mdAnchor from "markdown-it-anchor"
import mdVideo from "markdown-it-video"
import mdLinkAttributes from "markdown-it-link-attributes"
import mdImplicitFigures from "markdown-it-implicit-figures"

let markdownUtility: MarkdownIt

function getMarkdownUtility(): MarkdownIt {
  if (!markdownUtility) {
    markdownUtility = MarkdownIt({
      html: true,

      linkify: true,
      typographer: false
    })

    markdownUtility.use(mdAnchor, { slugify })
    markdownUtility.use(mdVideo)

    markdownUtility.use(mdLinkAttributes)
    markdownUtility.use(mdImplicitFigures, {
      dataType: true, // <figure data-type="image">, default: false
      figcaption: true, // <figcaption>alternative text</figcaption>, default: false
      tabindex: false, // <figure tabindex="1+n">..., default: false
      link: true // <a href="img.png"><img src="img.png"></a>, default: false
    })
  }

  return markdownUtility
}

interface MarkdownRenderOptions {
  variables?: boolean;
}

export function renderMarkdown(content = "", options?: MarkdownRenderOptions): string {
  const util = getMarkdownUtility()
  if (typeof content == "string") {
    const { variables } = options || {}
    if (variables) {
      content = content.replace(/{{([\S\s]+?)}}/g, matched => {
        const setting = matched.replace(/[{}]/g, "")
        const val = dotSetting({
          key: setting,
          settings: getStoreState()
        })

        return val || ""
      })
    }

    return util.render(content, options)
  } else {
    return ""
  }
}
