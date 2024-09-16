import Slash from "./handlers/loadCommands";
import Event from "./handlers/loadEvents";
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({
    intents: Object.keys(GatewayIntentBits).map(key => GatewayIntentBits[key as keyof typeof GatewayIntentBits]),
    partials: Object.keys(Partials).map(key => Partials[key as keyof typeof Partials]),
});


Slash(client);
Event(client);

client.login(process.env.token);
