const namespace = ['space:bookstore']
import { blueprint } from '../blueprint'
import { configureSpace } from "@flatfile/plugin-space-configure"
import { zipExtractorPlugin } from '@flatfile/plugin-zip-extractor'
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor'
import { automap } from '@flatfile/plugin-automap'
import { recordHook } from '@flatfile/plugin-record-hook'

import { exportWorkbookPlugin } from '@flatfile/plugin-export-workbook'

export default function flatfileEventListener(listener) {
  listener.namespace(namespace, (namespacedEvents) => {
    
    namespacedEvents.use(configureSpace(
      { 
        workbooks: [blueprint],
        space: {
          metadata: {
            theme: {
              root: {
                primaryColor: "#1f3270",
              },
              sidebar: {
                backgroundColor: "#1f3270",
                titleColor: "#ac8652",
                focusBgColor: "#ac8652",
                focusTextColor: "white",
                textColor: "white",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTypXZ37AlxraOpT5pZ8ELdCyxNHBfO2tPuA&usqp=CAU",
              },
            },
          },
        }
      },
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

    namespacedEvents.use(exportWorkbookPlugin())
  })
}