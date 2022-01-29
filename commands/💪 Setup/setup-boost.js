var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, swap_pages, swap_pages2
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-boostlog",
  category: "💪 Setup",
  aliases: ["setupboost", "boostlog-setup", "setupboostlog", "boostlogsetup"],
  cooldown: 5,
  usage: "setup-boostlog  -->  Follow the Steps",
  description: "Setup the Server Boost-Logs for the server",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed"); let ls = client.settings.get(message.guild.id, "language")
    console.log(client.settings.get(message.guild.id, "boostlogs.message"))
    /* ⚡ CODE HERE ⚡ */
    try {
      let Selection = new MessageSelectMenu()
        .setCustomId("MenuSelection")
        .setPlaceholder("Click me to setup the Boost-logging System!")
        .addOptions([
          {
            label: 'Enable Boost-Log For This Server',
            emoji: client.emoji.yes,
            description: "Enable Boosts Logs For The Server",
            value: "enable"
          },
          {
            label: "Edit Message For Boost-log",
            value: "edit",
            description: `Edit the Boost Message that is sent in the logs`,
            emoji: "933974319413989476"
          },
          {
            label: "Edit the Log channel",
            value: "editchannel",
            description: `Edit the channel new boosters will be logged in`,
            emoji: "933251978560176138"
          },
          {
            value: "settings",
            label: "Show Settings",
            description: `Show Settings of the Boost-Log`,
            emoji: "📑"
          },
          {
            label: "Test the Logger",
            value: "test",
            description: "Send a test message with your channel & message",
            emoji: "933973988047200296"
          },
          {
            label: "Disable Boost-log For This Server",
            emoji: client.emoji.no,
            description: "Disable Boosts Logs For The Server",
            value: "disable"
          }
        ])
      let SelectionEmbed = new MessageEmbed()
        .setColor(es.color)
        .setAuthor('Setup Boost-logger', 'https://cdn.discordapp.com/attachments/933237026885603448/933752454431006760/emoji.png', 'https://discord.gg/Notsaksh') // ⚡ Coded by NotUnknown#7466
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))

      let menumsg = await message.reply({
        embeds: [SelectionEmbed],
        components: [new MessageActionRow().addComponents(Selection)]
      })
      const collector = menumsg.createMessageComponentCollector({
        filter: i => i ?.isSelectMenu() && i ?.message.author.id == client.user.id && i ?.user,
        time: 90000
      })

      //Menu Collections
      collector.on('collect', async (menu) => {
        if (menu ?.user.id === cmduser.id) {
          collector.stop();
          if (menu ?.values[0] == "Cancel") return menu ?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu ?.deferUpdate();
          used1 = true;
          handle_the_picks(menu ?.values[0], menu)
        }
        else menu ?.reply({ content: `${client.emoji.no} You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true });
      });
      //Once the Collections ended edit the menu message
      collector.on('end', collected => {
        menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `${client.emoji.yes} **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}` })
      });
      async function handle_the_picks(optionhandletype, menu) {
        switch (optionhandletype) {
          case 'enable': {
            var tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setAuthor(`In which channel do you want to set?`, `https://cdn.discordapp.com/attachments/933237026885603448/933752454431006760/emoji.png`, client.credits)
                  .setDescription("In which channel do you want to setup the Booster-log?\n> *Mention the Channel or Channel **ID***")
                  .setFooter(es.footertext, es.footericon)
              ]
            })
            let filter = (m) => m.author.id === message.author.id
            const collector = tempmsg.channel.createMessageCollector({ filter, max: 2 })
            let boostchannel, boostmessage;
            let index = 0;
            collector.on("collect", async (msg) => {
              if (client.settings.get(message.guild.id, "boostlogs.channel") && client.settings.get(message.guild.id, "boostlogs.channel") != "no") {
                return message.reply(`${client.emoji.no} **The Boost-Logs are already set in <#${client.settings.get(message.guild.id, "boostlogs.channel")}>**`)
              }
              index++;
              if (index == 1) {
                let _ch = "";
                if (msg.content.startsWith("<#")) {
                  _ch = msg.content
                    .split("<").join("")
                    .split("#").join("")
                    .split(">").join("")
                } else {
                  _ch = msg.content;
                }
                const validch = message.guild.channels.cache.get(_ch)
                if (!validch) {
                  msg.reply("Invalid channel")
                  return collector.stop()
                }
                boostchannel = validch
                const bm = new MessageEmbed()
                  .setColor(es.color)
                  .setTitle(`Send the boost message`)
                  .setDescription(`<:Builder:933238842704674826> **VARIABLES:**\n> \`{member.name/mention}\` == **Booster's Username**\n> \`{guild.name}\` == **Server Name**\n> \`default\` == **Uses the default boost message**`)
                msg.channel.send({ embeds: [bm] })
              } else {
                if (msg.content == "default") {
                  boostmessage = "<a:Server_Boosts:933787999387390032> {member.mention} **has boosted us** "
                } else {
                  boostmessage = msg.content;
                }
              }
            })
            collector.on("end", async (collected) => {
              if (!boostchannel || !boostmessage) return;
              if (boostchannel.type !== "GUILD_TEXT") {
                return message.channel.send(`${client.emojino} **This must be a __TEXT__ channel!**`)
              }
              client.settings.set(message.guild.id, boostchannel, "boostlogs.channel")
              client.settings.set(message.guild.id, boostmessage, "boostlogs.message")
              const embed = new MessageEmbed()
                .setTitle(`${client.emoji.yes} Successfuly Set the Boost-Logging Channel!`)
                .setDescription(`*I will now log new boosts and unboosts in <#${boostchannel.id}>*\n\n**<:RoleIconBooster:933757661906882621> BOOST MESSAGE:**\n>>> ${boostmessage}`)
                .setColor(es.color)
              message.reply({ embeds: [embed] })
            })
          } break;
          case 'disable': {
            if (!client.settings.get(message.guild.id, "boostlogs.channel")) {
              return message.reply(`${client.emoji.no} **You haven't setup the Boost-Logger for this server yet!**\n• *Set it up using \`${prefix}setup-boostlog --> Enable\`*`)
            }
            if (client.settings.get(message.guild.id, "boostlogs.channel") == "no") {
              return message.reply(`${client.emoji.no} **The Boost-Logger is already disabled in this server!**\n• *To re-enable it, use \`${prefix}setup-boostlog --> Enable\`*`)
            }
            client.settings.set(message.guild.id, "no", "boostlogs.channel")
            const embed = new MessageEmbed()
              .setTitle(`${client.emoji.yes} Disabled the Boost-Logger`)
              .setDescription(`*I will __No Longer__ send boost updates in this server!*`)
              .setColor(es.color)
            message.reply({ embeds: [embed] })
          } break;
          case 'edit': {
            var tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setAuthor(`What should the new message be?`, `https://cdn.discordapp.com/attachments/933237026885603448/933752454431006760/emoji.png`, client.credits)
                  .setDescription(`<:Builder:933238842704674826> **VARIABLES:**\n> \`{member.name/mention}\` == **Booster's Username**\n> \`{guild.name}\` == **Server Name**`)
                  .setFooter(es.footertext, es.footericon)
              ]
            })
            let filter = (m) => m.author.id === message.author.id
            const collector = tempmsg.channel.createMessageCollector({ filter, max: 1 })
            let boostmessage;
            let index = 0;
            collector.on("collect", async (msg) => {
              boostmessage = msg.content;
            })
              collector.on("end", async (collected) => {
              if (!boostmessage) return;
              client.settings.set(message.guild.id, boostmessage, "boostlogs.message")
              const msg = client.settings.get(message.guild.id, "boostlogs.message")
const _message = msg
      .split("{member.name}").join(message.author.username)
      .split("{guild.name}").join(message.author.name)
      .split("{member.mention}").join("<@!" + message.author.id + ">")
              const embed = new MessageEmbed()
                .setTitle(`${client.emoji.yes} Successfuly Set the new Boost message!`)
                .setDescription(`**<:RoleIconBooster:933757661906882621> NEW BOOST MESSAGE:**\n>>> ${_message}`)
                .setColor(es.color)
              message.reply({ embeds: [embed] })
            })
          } break;
          case 'editchannel': {
            var tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setAuthor(`What should the new channel be?`, `https://cdn.discordapp.com/attachments/933237026885603448/933752454431006760/emoji.png`, client.credits)
                  .setDescription(`*Mention it with #Channel*`)
                  .setFooter(es.footertext, es.footericon)
              ]
            })
            let filter = (m) => m.author.id === message.author.id
            const collector = tempmsg.channel.createMessageCollector({ filter, max: 1 })
            let boostchannel;
            let index = 0;
            collector.on("collect", async (msg) => {
              let _ch = "";
                if (msg.content.startsWith("<#")) {
                  _ch = msg.content
                    .split("<").join("")
                    .split("#").join("")
                    .split(">").join("")
                } else {
                  _ch = msg.content;
                }
                const validch = message.guild.channels.cache.get(_ch)
                if (!validch) {
                  msg.reply(`${client.emojino} **This is an Invalid Channel!**`)
                  return collector.stop()
                }
                boostchannel = validch
            })
              collector.on("end", async (collected) => {
              if (!boostchannel) return;
              client.settings.set(message.guild.id, boostchannel, "boostlogs.channel")
              const embed = new MessageEmbed()
                .setTitle(`${client.emoji.yes} Successfuly Set the new Boost channel!`)
                .setDescription(`The boost-logging channel is now ${boostchannel}!`)
                .setColor(es.color)
              message.reply({ embeds: [embed] })
            })
          } break;
          case 'test': {
            const channel = client.settings.get(message.guild.id, "boostlogs.channel")
            const msg = client.settings.get(message.guild.id, "boostlogs.message")
const _message = msg
      .split("{member.name}").join(message.author.username)
      .split("{guild.name}").join(message.author.name)
      .split("{member.mention}").join("<@!" + message.author.id + ">")
      if(!channel) return message.reply(`${client.emoji.no} **The Boost-Logger isnt setup yet!**`)
       
           if(channel) { 
             message.reply({ content: `${client.emoji.yes} ***Sent the __TEST-LOG__ in <#${channel.id || message.channel.id}>!***`, ephemeral: true })
            client.channels.cache.get(channel.id || message.channel.id).send({
        embeds: [
          new MessageEmbed()
            .setAuthor(`TEST-LOG | ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor("LUMINOUS_VIVID_PINK") 
            .setDescription(`${_message}`)
            .setFooter(`ID: ${message.author.id}`)
            .setTimestamp()
        ]
      })
           }
          } break;
          case 'settings': {
           const channel = client.settings.get(message.guild.id, "boostlogs.channel")
            const msg = client.settings.get(message.guild.id, "boostlogs.message")
const _message = msg
      .split("{member.name}").join(message.author.username)
      .split("{guild.name}").join(message.author.name)
      .split("{member.mention}").join("<@!" + message.author.id + ">")
      

      const embed = new MessageEmbed()
      .setTitle(`📃 Boost-Log Settings:`)
      .setColor(es.color)
      .addField(`<:Channel:933251978560176138> Channel:`, `${channel == "no" ? "Not Setupped" : `<#${channel.id}> | \`${channel.name}\``}`)
      .addField(`<:Announcment:933974319413989476> Message:`, `${_message}`)

      message.reply({ embeds: [embed] })
          }
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable21"]))]
      }
      );
    }
  }
}