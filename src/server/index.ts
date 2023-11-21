import 'https://deno.land/std@0.206.0/dotenv/load.ts'
import {Hono} from "https://deno.land/x/hono@v3.10.1/mod.ts"
import {cache, compress, logger, poweredBy, prettyJSON, timing} from "https://deno.land/x/hono@v3.10.1/middleware.ts"
import {MongoClient,} from "https://deno.land/x/atlas_sdk@v1.1.2/mod.ts";
import {Database} from "https://deno.land/x/atlas_sdk@v1.1.2/client.ts";
import {StoneServerConfig} from "../config/index.ts";
import {BaseRepository} from "../repository/base-repository.ts";
import {BaseEntity} from "../interfaces/base-entity.inteface.ts";

export class StoneServer {
    private readonly serverConfig: StoneServerConfig

    private honoServer: Hono
    private readonly mongoClient: MongoClient;
    private readonly mongoDatabase: Database

    private repositories: BaseRepository<any>[]

    constructor() {
        this.serverConfig = new StoneServerConfig()
        this.honoServer = new Hono()

        this.honoServer.use('*', timing());
        this.honoServer.use('*', compress())
        this.honoServer.use('*', prettyJSON())
        this.honoServer.use('*', logger(), poweredBy())
        this.honoServer.get(
            '*',
            cache({
                cacheName: this.serverConfig.getAppName(),
                cacheControl: 'max-age=3600',
                wait: true,
            })
        )

        this.honoServer.get('/', (c) => {
            return c.json({
                name: this.serverConfig.getAppName(),
                version: this.serverConfig.getAppVersion()
            })
        })

        this.mongoClient = new MongoClient({
            endpoint: `https://data.mongodb-api.com/app/${this.serverConfig.getMongoAppId()}/endpoint/data/v1`,
            dataSource: this.serverConfig.getMongoClusterName(),
            auth: {
                apiKey: this.serverConfig.getMongoApiKey(),
            },
        });

        this.mongoDatabase = this.mongoClient.database(this.serverConfig.getMongoDatabaseName());

        this.repositories = []
    }

    public listen(): void {
        Deno.serve({port: this.serverConfig.getPort()}, this.honoServer.fetch)
    }

    public addRepository<T extends BaseEntity>(): void {
        const repository = new BaseRepository<T>(this.mongoDatabase, T.name)
        this.repositories.push(repository)
    }
}