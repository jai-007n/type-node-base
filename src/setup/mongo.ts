import mongoose from "mongoose";
import colors from "colors";

interface MongoConfig {
    database: string;
    url: string;
}

export default class SetupMongo {
    private connectionUri: string;

    constructor(mongo: MongoConfig) {
        const { database, url } = mongo;

        this.connectionUri = `${url}/${database}`;

        console.log(
            "connection uri is ",
            this.connectionUri.blue.underline.bold
        );
    }

    async connectMongo(): Promise<void> {
        try {
            await mongoose.connect(this.connectionUri);

            console.log(
                "MongoDb is connected successfully".green.underline.bold
            );
        } catch (err: unknown) {
            console.error(
                "MongoDB connection error:",
                err
            );
            throw err;
        }
    }

    disconnectMongo(): void {
        mongoose
            .disconnect()
            .then(() => {
                console.log(
                    "MongoDB Disconnected".magenta.underline.bold
                );
            })
            .catch((err: unknown) => {
                console.error("MongoDB Disconnection Error:", err);
            });
    }

    async resetMongo(): Promise<void> {
        await mongoose.connection.dropDatabase();

        console.log(
            "MongoDB Refresh with clearing database".grey.underline.bold
        );
    }

    async clearCollections(): Promise<void> {
        const collections: Record<string, mongoose.Collection> | undefined | any = mongoose.connection.collections;

        for (const key in collections) {
            const collection: mongoose.Collection = collections[key];
            if (!collection) continue;
            try {
                await collection.deleteMany();
                console.log(`Cleared ${key}`);
            } catch (err) {
                console.error(`Failed to clear ${key}:`, err);
            }
        }
    }
}