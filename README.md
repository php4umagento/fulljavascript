# FullJavascript

[![Netlify Status](https://api.netlify.com/api/v1/badges/76ec388d-1af0-4084-85d2-da7cb9188ce9/deploy-status)](https://app.netlify.com/sites/fulljavascript/deploys)

The project is divided in 3 parts.

## Storefront

Contains plain static HTML/CSS/JS files.

```
live-server storefront
```

## Server

Deploy to heroku:

```
git subtree push --prefix server heroku master && heroku logs --tail
```