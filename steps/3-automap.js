const namespace = ['space:bookstore']
import { blueprint } from '../blueprint'
import { configureSpace } from "@flatfile/plugin-space-configure"
import { zipExtractorPlugin } from '@flatfile/plugin-zip-extractor'
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor'

import { automap } from '@flatfile/plugin-automap'

export default function flatfileEventListener(listener) {
  listener.namespace(namespace, (namespacedEvents) => {
    
    namespacedEvents.use(configureSpace(
      { workbooks: [blueprint] },
      async (event, workbookIds, tick,) => {
        await tick(80, "Creating Space")
      }
    ))

    namespacedEvents.use(zipExtractorPlugin())
    namespacedEvents.use(xlsxExtractorPlugin())

    namespacedEvents.use(
      automap({
        accuracy: "confident",
        defaultTargetSheet: "inventory",
        matchFilename: /^.+\.xlsx$/,
        onFailure: (error) => {
          console.error('error', error)
        }
      })
    )
  })
}