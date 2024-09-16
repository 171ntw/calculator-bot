import { Client, Collection, RESTPostAPIApplicationCommandsJSONBody, Guild } from "discord.js";
import { readdirSync, statSync } from "fs";
import { join } from "path";

export interface Command {
    name: string;
    description?: string;
    run: (...args: any[]) => void;
    data: RESTPostAPIApplicationCommandsJSONBody;
}

declare module 'discord.js' {
    interface Client {
        slashCommands: Collection<string, Command>;
    }
}

export default async function run(client: Client) {
    client.slashCommands = new Collection<string, Command>();
    const commandsArray: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandsPath = join(__dirname, '../commands');

    function getDirectories(path: string): string[] {
        return readdirSync(path).filter(file => statSync(join(path, file)).isDirectory());
    }

    const commandFolders = getDirectories(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = join(commandsPath, folder);
        const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            const command: Command = require(join(folderPath, file)).default;

            if (command && typeof command.name === 'string') {
                client.slashCommands.set(command.name, command);
                commandsArray.push(command.data);
                console.log(`Comando ${command.name} carregado.`);
            } else {
                console.error(`Comando no arquivo ${file} não tem a estrutura esperada.`);
            }
        }
    }

    client.on('ready', async () => {
        if (client.user) {
            client.guilds.cache.forEach(async (guild: Guild) => {
                try {
                    await guild.commands.set(commandsArray);
                    console.log(`Comandos sincronizados para o servidor ${guild.name}`);
                } catch (error) {
                    console.error(`Erro ao definir comandos para o servidor ${guild.name}:`, error);
                }
            });
        }
    });

    client.on('guildCreate', async (guild: Guild) => {
        try {
            await guild.commands.set(commandsArray);
            console.log(`Comandos sincronizados para o novo servidor ${guild.name}`);
        } catch (error) {
            console.error(`Erro ao definir comandos para o novo servidor ${guild.name}:`, error);
        }
    });
}
