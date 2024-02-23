const namespace = ['space:bookstore']
import { blueprint } from '../blueprint'
import { configureSpace } from "@flatfile/plugin-space-configure"
import { zipExtractorPlugin } from '@flatfile/plugin-zip-extractor'
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor'
import { automap } from '@flatfile/plugin-automap'

import { recordHook } from '@flatfile/plugin-record-hook'

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

    namespacedEvents.use(
      recordHook('inventory', (record) => {
        const isbn = record.get('ISBN')
        const validISBN = /^978-\d{10}$/

        if (!validISBN.test(isbn)) {
          record.addError("ISBN", "Invalid ISBN")
        }
      })
    )
  })
}