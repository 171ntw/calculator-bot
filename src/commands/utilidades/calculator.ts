import { CommandInteraction, Client } from "discord.js";
import { Command } from "../../handlers/loadCommands";
import { Calculator } from "../../functions/calculator";

const CalculatorCommand: Command = {
    name: 'calculator',
    description: 'Comando para realizar cálculos básicos',
    data: {
        name: 'calculator',
        description: 'Uma calculadora embutida no Discord.',
    },
    run: async (client: Client, interaction: CommandInteraction) => {
        await Calculator(interaction, client);
    }
};

export default CalculatorCommand;
