# northshire-demo

First, ensure your credentials are available. Locate these in your Dashboard.

```
FLATFILE_API_KEY={{secret_key}}
FLATFILE_ENVIRONMENT_ID={{env_id}}
```


Then run your local listener.

```
npx flatfile develop {{path_to_file}}
```

### Listener Steps

| Step    | Problem    | Solution    |
|-------------|-------------|-------------|
| 1-base | Import solution | Make a data schema and a listener |
| 2-extractors | Support my file format | Add extractor plugins |
| 3-automap | Do the mapping for me | Add automap plugin |
| 4-recordhook | Add custom validation | Add recordhook plugin, write validation |
| 5-workbook | Download my data | Add workbook export plugin |
| 6-theme | Whitelabel my importer | Customize my space upon configuration |
| 7-document | Provide in-app information | Add a document |

