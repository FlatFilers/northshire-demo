export const blueprint = {
  name: 'Northshire Books Inventory',
  "sheets": [
    {
      "name": "Inventory",
      "slug": "inventory",
      "fields": [
        {
          "key": "ISBN",
          "label": "ISBN",
          "type": "string"
        },
        {
          "key": "Author",
          "label": "Author",
          "type": "string"
        },
        {
          "key": "Title",
          "label": "Title",
          "type": "string"
        },
        {
          "key": "Stock",
          "label": "Stock",
          "type": "number"
        }
      ]
    },
    {
      "name": "Holds",
      "slug": "holds",
      "fields": [
        {
          "key": "ISBN",
          "label": "ISBN",
          "type": "reference",
          "config": {
            "ref": "inventory",
            "key": "ISBN",
            "relationship": "has-one"
          }
        },
        {
          "key": "Quantity",
          "label": "Quantity",
          "type": "number"
        },
        {
          "key": "Customer Name",
          "label": "Customer Name",
          "type": "string"
        },
        {
          "key": "Customer Email",
          "label": "Customer Email",
          "type": "string"
        }
      ]
    }
  ],
  "actions": [
    {
      "operation": "downloadWorkbook",
      "mode": "foreground",
      "label": "Submit",
      "primary": true
    }
  ]
}