import {BaseEntity} from "./base-entity.inteface.ts";

export interface IBaseRepository<T extends BaseEntity> {
    create(entity: T): Promise<T>;

    createMany(entities: T[]): Promise<T[]>;

    update(entity: T): Promise<T>;

    updateMany(entities: T[]): Promise<T[]>;

    delete(id: string): Promise<void>;

    deleteMany(ids: string[]): Promise<void>;

    findById(id: string): Promise<T>;

    findAll(page: number, size: number): Promise<T[]>;
}