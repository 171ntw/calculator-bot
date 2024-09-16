import { Events, Client } from "discord.js";
import { Event } from "../../handlers/loadEvents";

const clientReady: Event = {
    name: Events.ClientReady,
    once: true,

    run: async (client: Client) => {
        console.clear();
        console.log('\x1b[36m[CLIENT]\x1b[0m Iniciado com sucesso.');
        console.log('\x1b[32m[1NTW]\x1b[0m https://github.com/171ntw/calculator-bot');
    }
};

export default clientReady;