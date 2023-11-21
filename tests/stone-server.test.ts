import {BaseEntity, StoneServer} from "../main.ts";
import {ObjectId,} from "https://deno.land/x/atlas_sdk@v1.1.2/mod.ts";

Deno.test("StoneServer", () => {
    class User implements BaseEntity {
        _id: ObjectId;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        password: string;

        constructor(name: string, email: string, password: string) {
            this._id = new ObjectId();
            this.name = name;
            this.email = email;
            this.password = password;
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    const server = new StoneServer();

    server.addRepository(User);

});