
import { Hono } from "https://deno.land/x/hono@v3.10.1/mod.ts"
import { cache } from "https://deno.land/x/hono@v3.10.1/middleware.ts"
import { logger, poweredBy, compress, timing, prettyJSON  } from "https://deno.land/x/hono@v3.10.1/middleware.ts"


export class StoneServer {
    private server: Hono

    constructor(appName: string, appVersion: string) {
        this.server = new Hono()
        this.server.use('*', timing());
        this.server.use('*', compress())
        this.server.use('*', prettyJSON())
        this.server.use('*', logger(), poweredBy())
        this.server.get(
            '*',
            cache({
                cacheName: appName,
                cacheControl: 'max-age=3600',
                wait: true,
            })
        )

        this.server.get('/', (c) => {
            return c.json({
                name: appName,
                version: appVersion
            })
        })
    }

    public start(): void {
        const port = parseInt(Deno.env.get('PORT') || "8080")
        Deno.serve({ port: port }, this.server.fetch)
    }
}