import Database from "../mongo";
import "colors";
import config from "config";
import App from "../app";

export const initializeApp = async (): Promise<void> => {
    try {
        // creating database connection
        const db = new Database(config.get("mongo"));
        await db.connectMongo();

        // creating app singleton instance
        const app = new App();

        // app listening to the port
        app.listen();
    } catch (err: any) {
        console.error(
            "Something went wrong when initializing the server:\n".red.underline.bold,
            err.stack
        );
    }
};