# To-Do List App

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/to-do-list-kv-template)

![To-Do List Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/923473bc-a285-487c-93db-e0ddea3d3700/public)

<!-- dash-content-start -->

Manage your to-do list with [Cloudflare Workers Assets](https://developers.cloudflare.com/workers/static-assets/) + [Remix](https://remix.run/) + [Cloudflare Workers KV](https://developers.cloudflare.com/kv/).

## How It Works

This is a simple to-do list app that allows you to add, remove, and mark tasks as complete. The project is a Cloudflare Workers Assets application built with Remix. It uses Cloudflare Workers KV to store the to do list items. The [Remix Vite Plugin](https://remix.run/docs/en/main/guides/vite#vite) has a Cloudflare Dev Proxy that enables you to use [Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) provided by the Cloudflare Developer Platform. [Observability](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#enable-workers-logs) is on by default.

> [!IMPORTANT]
> When using C3 to create this project, select "no" when it asks if you want to deploy. You need to follow this project's [setup steps](https://github.com/cloudflare/templates/tree/main/to-do-list-kv-template#setup-steps) before deploying.

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/to-do-list-kv-template
```

A live public deployment of this template is available at [https://to-do-list-kv-template.templates.workers.dev](https://to-do-list-kv-template.templates.workers.dev)

## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm install
   ```
2. Create a [kv namespace](https://developers.cloudflare.com/kv/get-started/) with a binding named "TO_DO_LIST":
   ```bash
   npx wrangler kv namespace create TO_DO_LIST
   ```
   ...and update the `kv_namespaces` -> `id` field in `wrangler.json` with the new namespace ID.
3. Build the application:
   ```bash
   npm run build
   ```
4. Deploy it!
   ```bash
   npx wrangler deploy
   ```
5. And monitor your worker!
   ```bash
   npx wrangler tail
   ```

## project discription
* environment management: Node.js, a open source & multi-platform execution env for javascript
* project properities:
   1. serverless framework: The system does not rely on a dedicated server. It only uses the database and front-end logic, while each incoming request is dynamically handled by an available node in the cluster that is temporarily assigned to execute the job.
* remex framework: 
   * back-end will send HTML + js, and claims this is a Remix web. The broser will first shows the html to user, then it will add js to html secretly, which can present webpage to user quickly.
   * file system is the routing system, every .jsx or .tsx under app/route is an URL->app/routes/_index.jsx is the root directory.
   * Route file should contain all logics which are used to deal with back-end HTTP request(like click event) and front end interactive logic.


* app: 
   * entry.client.tsx: front-end user interact logic
   * entry.server.tsx: back-end webpage render
   * root.tsx: html backbone
   * to-do-manager.ts: define how back-end interact with kv database
   * routes
      * $id.tsx: back-end data-related request processing

* sever.ts: entry for application
* wrangler.jsonc: set up db connection for web