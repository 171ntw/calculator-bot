import { Events, Interaction, Client } from "discord.js";
import { Event } from "../../handlers/loadEvents";

const CreateCommand: Event = {
    name: Events.InteractionCreate,
    once: false,

    run: async (interaction: Interaction, client: Client) => {
        if (interaction.isCommand()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            interaction['member'] = interaction.guild?.members.cache.get(interaction.user.id) || null;;

            try {
                command.run(client, interaction);
            } catch (e) {
                console.error(`Erro ao executar o comando ${interaction.commandName}:`, e);
            }
        }
    }
};

export default CreateCommand;