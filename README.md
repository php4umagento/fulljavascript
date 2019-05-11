# FullJavascript

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