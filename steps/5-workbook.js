const namespace = ['space:bookstore']
import api from '@flatfile/api'
import { blueprint } from '../blueprint'
import { zipExtractorPlugin } from '@flatfile/plugin-zip-extractor'
import { xlsxExtractorPlugin } from '@flatfile/plugin-xlsx-extractor'
import { automap } from '@flatfile/plugin-automap'
import { recordHook } from '@flatfile/plugin-record-hook'

import { exportWorkbookPlugin } from '@flatfile/plugin-export-workbook'

export default function flatfileEventListener(listener) {
  listener.namespace(namespace, (namespacedEvents) => {
    namespacedEvents.filter({ job: 'space:configure' }, (configure) => {
      configure.on(
        'job:ready',
        async ({ context: { spaceId, environmentId, jobId } }) => {
          try {
            await api.jobs.ack(jobId, {
              info: 'Creating Space',
              progress: 10,
            })

            await api.workbooks.create({
              spaceId,
              environmentId,
              ...blueprint,
            })

            await api.jobs.complete(jobId, {
              outcome: {
                message: 'Space Created',
                acknowledge: true,
              },
            })
              
          } catch (error) {
            await api.jobs.fail(jobId, {
              outcome: {
                message:
                  'Space Creation Failed. See Event Logs',
                acknowledge: true,
              },
            })
          }
        }
      )
    })

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
