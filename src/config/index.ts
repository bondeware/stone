export class StoneServerConfig {
    private readonly appName: string
    private readonly appVersion: string
    private readonly port: number
    private readonly mongoClusterName: string
    private readonly mongoAppId: string
    private readonly mongoApiKey: string
    private readonly mongoDatabaseName: string

    constructor() {
        this.appName = Deno.env.get('APP_NAME') || "Stone Server"
        this.appVersion = Deno.env.get('APP_VERSION') || "0.0.1"
        this.port = parseInt(Deno.env.get('PORT') || "8080")
        this.mongoClusterName = Deno.env.get('MONGO_CLUSTER_NAME') || ""
        this.mongoAppId = Deno.env.get('MONGO_APP_ID') || ""
        this.mongoApiKey = Deno.env.get('MONGO_API_KEY') || ""
        this.mongoDatabaseName = Deno.env.get('MONGO_DATABASE_NAME') || ""
    }

    public getAppName(): string {
        return this.appName
    }

    public getAppVersion(): string {
        return this.appVersion
    }

    public getPort(): number {
        return this.port
    }

    public getMongoClusterName(): string {
        return this.mongoClusterName
    }

    public getMongoAppId(): string {
        return this.mongoAppId
    }
    public getMongoApiKey(): string {
        return this.mongoApiKey
    }

    public getMongoDatabaseName(): string {
        return this.mongoDatabaseName
    }

}