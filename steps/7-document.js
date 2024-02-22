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

            await api.documents.create(spaceId, {
              title: "Inventory Project",
              body: "# Northshire Inventory Management Project\n\n## Project Overview\n\nThe Inventory Management Project at Northshire Books Company is designed to streamline our inventory processes, enhance our stock accuracy, and improve overall operational efficiency. By integrating state-of-the-art software and adopting best practices in inventory management, we aim to maintain optimal stock levels, reduce overstock and shortages, and ensure a seamless flow of books to meet our customer's needs.\n\n## Objectives\n\n- **Enhance Inventory Accuracy**: Implement real-time tracking to maintain accurate stock levels.\n- **Improve Efficiency**: Automate inventory processes to save time and reduce manual errors.\n- **Optimize Stock Levels**: Balance stock levels to meet demand without overstocking.\n- **Data-Driven Decisions**: Leverage inventory data to make informed purchasing and sales decisions.\n\n## Key Features\n\n- **Real-Time Inventory Tracking**: Utilize barcode scanning and RFID tags for instant updates.\n- **Automated Reordering System**: Set thresholds for automatic reordering of bestsellers and niche titles.\n- **Analytics Dashboard**: Monitor sales trends, stock levels, and order history in a comprehensive dashboard.\n- **Multi-Location Management**: Seamlessly manage inventory across multiple stores and online platforms.\n\n## Implementation Timeline\n\n1. **Project Kickoff**: July 1, 2024\n3. **System Integration & Testing**: July 1 - August 31, 2024\n4. **Employee Training**: September 1 - September 15, 2024\n5. **Go-Live**: October 1, 2024\n\n\n## Risks and Mitigation Strategies\n\n- **Data Migration Errors**: Conduct thorough testing and validation of data before full migration.\n- **Employee Adoption**: Provide comprehensive training and ongoing support to ensure smooth adoption.\n- **Software Limitations**: Work closely with the software provider to customize features as needed.\n\n## Conclusion\n\nThe Inventory Management Project is a critical step forward for Northshire Books Company. By modernizing our inventory practices, we will better serve our customers, streamline our operations, and set the stage for future growth. We look forward to the successful completion and implementation of this project.\n\n[Example Code Repository](https://github.com/FlatFilers/northshire-demo)"
            })
  
            const spaceUpdateParams = {
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
            };
  
            await api.spaces.update(spaceId, spaceUpdateParams);
  
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
    
    namespacedEvents.use(zipExtractorPlugin())
    namespacedEvents.use(xlsxExtractorPlugin())
  })
}
