// Local wrapper for the FlyonUI Tailwind plugin.
// Workaround for Node.js 22+ requiring `with { type: "json" }` for JSON imports,
// which causes @tailwindcss/vite to misresolve flyonui to flyonui.css.
import { pluginOptionsHandler } from 'flyonui/functions/pluginOptionsHandler.js'
import { plugin } from 'flyonui/functions/plugin.js'
import variables from 'flyonui/functions/variables.js'
import themesObject from 'flyonui/theme/object.js'
import { base, components, utilities } from 'flyonui/imports.js'

const version = '2.4.1'

export default plugin.withOptions(
  options => {
    return ({ addBase, addComponents, addUtilities }) => {
      const { include, exclude, prefix = '' } = pluginOptionsHandler(options, addBase, themesObject, version)

      const shouldIncludeItem = name => {
        if (include && exclude) {
          return include.includes(name) && !exclude.includes(name)
        }
        if (include) return include.includes(name)
        if (exclude) return !exclude.includes(name)
        return true
      }

      Object.entries(base).forEach(([name, item]) => {
        if (!shouldIncludeItem(name)) return
        item({ addBase, prefix })
      })

      Object.entries(components).forEach(([name, item]) => {
        if (!shouldIncludeItem(name)) return
        item({ addComponents, prefix })
      })

      Object.entries(utilities).forEach(([name, item]) => {
        if (!shouldIncludeItem(name)) return
        item({ addUtilities, prefix })
      })
    }
  },
  () => ({
    theme: {
      extend: variables
    }
  })
)
