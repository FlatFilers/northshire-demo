const namespace = ['space:bookstore']
import { blueprint } from '../blueprint'
import { configureSpace } from "@flatfile/plugin-space-configure"

export default function flatfileEventListener(listener) {
  listener.namespace(namespace, (namespacedEvents) => {
    
    namespacedEvents.use(configureSpace(
      { workbooks: [blueprint] },
      async (event, workbookIds, tick,) => {
        await tick(80, "Creating Space")
      }
    ))
  })
}