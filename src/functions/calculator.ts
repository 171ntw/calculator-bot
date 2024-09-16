import { CommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

export async function Calculator(interaction: CommandInteraction, client: Client) {
    let current = '';
    let previous = '';
    let operation = '';

    const getDisplay = () => {
        return current === '' ? '0' : current;
    };

    const createButtons = () => {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('calc_7').setLabel('7').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_8').setLabel('8').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_9').setLabel('9').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_divide').setLabel('/').setStyle(ButtonStyle.Secondary)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('calc_4').setLabel('4').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_5').setLabel('5').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_6').setLabel('6').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_multiply').setLabel('*').setStyle(ButtonStyle.Secondary)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('calc_1').setLabel('1').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_2').setLabel('2').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_3').setLabel('3').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_minus').setLabel('-').setStyle(ButtonStyle.Secondary)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('calc_0').setLabel('0').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_decimal').setLabel('.').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('calc_equals').setLabel('=').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('calc_plus').setLabel('+').setStyle(ButtonStyle.Secondary)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('calc_clear').setLabel('C').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('calc_percent').setLabel('%').setStyle(ButtonStyle.Secondary)
                )
        ];
    };

    const getExpirationField = () => {
        const startTime = Date.now();
        const minutesLeft = Math.max(0, Math.floor((120000 - (Date.now() - startTime)) / 60000));
        return {
            name: 'Tempo Restante',
            value: `A calculadora expirará em ${minutesLeft} minuto(s).`,
            inline: true
        };
    };

    const calculatorEmbed = new EmbedBuilder()
        .setTitle('Calculadora')
        .setColor('#000000')
        .setDescription(`\`\`\`${getDisplay()}\`\`\``)
        .addFields(getExpirationField());

    const message = await interaction.reply({ embeds: [calculatorEmbed], components: createButtons(), fetchReply: true });

    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
    });

    const calculate = () => {
        const prev = parseFloat(previous);
        const curr = parseFloat(current);

        switch (operation) {
            case '+':
                return prev + curr;
            case '-':
                return prev - curr;
            case '*':
                return prev * curr;
            case '/':
                return prev / curr;
            case '%':
                return prev % curr;
            default:
                return curr;
        }
    };

    collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({ content: 'Essa calculadora não é para você!', ephemeral: true });
        }

        const id = i.customId;

        if (id.startsWith('calc_')) {
            const value = id.split('_')[1];

            if (!isNaN(parseInt(value))) {
                current += value;
            } else if (value === 'clear') {
                current = '';
                previous = '';
                operation = '';
            } else if (value === 'equals') {
                current = calculate().toString();
                previous = '';
                operation = '';
            } else if (value === 'decimal') {
                if (!current.includes('.')) {
                    current += '.';
                }
            } else if (['plus', 'minus', 'multiply', 'divide', 'percent'].includes(value)) {
                if (current === '') return;
                previous = current;
                current = '';
                operation = {
                    plus: '+',
                    minus: '-',
                    multiply: '*',
                    divide: '/',
                    percent: '%'
                }[value]!;
            }

            const updatedEmbed = new EmbedBuilder()
                .setTitle('Calculadora')
                .setColor('#000000')
                .setDescription(`\`\`\`${getDisplay()}\`\`\``)
                .addFields(getExpirationField());

            await i.update({ embeds: [updatedEmbed], components: createButtons() });
        }
    });

    collector.on('end', () => {
        message.edit({ components: [] });
    });
}
