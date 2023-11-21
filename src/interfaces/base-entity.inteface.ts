import {
    ObjectId,
} from "https://deno.land/x/atlas_sdk@v1.1.2/mod.ts";

export interface BaseEntity {
    _id: ObjectId
    createdAt: Date
    updatedAt: Date
}