import { Client, ClientEvents } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    run(...args: any[]): void;
}

export default function (client: Client) {
    const eventsPath = join(__dirname, '../events');

    readdirSync(eventsPath).forEach(folder => {
        const folderPath = join(eventsPath, folder);
        const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of eventFiles) {
            const eventPath = join(folderPath, file);
            const event: Event = require(eventPath).default;

            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client));
            } else {
                client.on(event.name, (...args) => event.run(...args, client));
            }
        }
    });
};