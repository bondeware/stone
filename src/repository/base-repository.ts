import plural from "npm:plural";
import {Collection, ObjectId} from "https://deno.land/x/atlas_sdk@v1.1.2/mod.ts";
import {Database} from "https://deno.land/x/atlas_sdk@v1.1.2/client.ts";
import {BaseEntity} from "../interfaces/base-entity.inteface.ts";
import {IBaseRepository} from "../interfaces/base-repository.interface.ts";

export class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
    private readonly collection: Collection<T>

    constructor(mongoDatabase: Database, entityClass: new () => T) {
        const collectionName = plural(entityClass.name.toLowerCase())
        this.collection = mongoDatabase.collection<T>(collectionName)
    }

    async create(entity: T): Promise<T> {
        const result = await this.collection.insertOne(entity)
        entity._id = new ObjectId(result.insertedId)
        return entity
    }

    async createMany(entities: T[]): Promise<T[]> {
        const result = await this.collection.insertMany(entities)
        entities.forEach((entity, index) => {
            entity._id = new ObjectId(result.insertedIds[index])
        })
        return entities
    }

    async delete(id: string): Promise<void> {
        await this.collection.deleteOne({_id: new ObjectId(id)})
    }

    async findAll(page: number, size: number): Promise<T[]> {
        return await this.collection.find({
            limit: size,
            skip: page * size,
            sort: {createdAt: -1}
        })
    }

    async findById(id: string): Promise<T> {
        return await this.collection.findOne({_id: new ObjectId(id)})
    }

    async update(entity: T): Promise<T> {
        await this.collection.updateOne({_id: entity._id}, entity)
        return entity
    }

    async deleteMany(ids: string[]): Promise<void> {
        await this.collection.deleteMany({_id: {$in: ids.map(id => new ObjectId(id))}})
    }

    async updateMany(entities: T[]): Promise<T[]> {
        await Promise.all(entities.map(entity => this.update(entity)))
        return entities
    }
}