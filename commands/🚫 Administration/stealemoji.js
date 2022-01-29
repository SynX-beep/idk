const { Util, MessageEmbed } = require("discord.js");
const { parse } = require("twemoji-parser");

const ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
  name: "stealemoji",
  aliases: ["steal"],
  category: `🚫 Administration`,
  cooldown: 4,
  memberpermissions: ["ADMINISTRATOR"],
  type: "server",
  run: async (client, message, args, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
let ls = client.settings.get(message.guild.id, "language")  

    
    const emoji = args[0];
    const name = args.slice(1).join(" ");
    if (!emoji) {
      const embed = new MessageEmbed()
               .setTitle(`<:no:933239221836206131> Please give me an Emoji to add!`)
               .setColor(ee.wrongcolor)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setFooter(es.footertext, es.footericon)
      return message.channel.send({ embeds: [embed] })
    }

    try {
      if (emoji.startsWith("https://cdn.discordapp.com")) {
        await message.guild.emojis.create(emoji, name || "give_name");

        const embed = new MessageEmbed()
          .setTitle(`<a:yes:933239140718358558> Added the Emoji!`)
          .setThumbnail(emoji)
          .setColor(ee.color)
      .setFooter(es.footertext, es.footericon)
          .setDescription(
            `Emoji Name: \`${
              name || "give_name"
            }\` `
          );
        return message.channel.send({ embeds: [embed] })
      }

      const customEmoji = Util.parseEmoji(emoji);

      if (customEmoji.id) {
        const link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${
          customEmoji.animated ? "gif" : "png"
        }` ;

        await message.guild.emojis.create(
          `${link}`,
          `${name || `${customEmoji.name}`}`
        ).then(emoji => {
       
        const embed = new MessageEmbed()
          .setTitle(`<a:yes:933239140718358558> Added ${emoji.toString()}`)
          .setColor(ee.color)
      .setFooter(es.footertext, es.footericon)
          .setThumbnail(`${link}`)
          
        return message.channel.send({ embeds: [embed] })
        });
      } else {
        const foundEmoji = parse(emoji, { assetType: "png" });
        if (!foundEmoji[0]) {
           const embed = new MessageEmbed()
               .setTitle(`<:no:933239221836206131> Provide a valid emoji.`)
               .setColor(ee.wrongcolor)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setFooter(es.footertext, es.footericon)
          return message.channel.send({ embeds: [embed] });
        }
        const embed = new MessageEmbed()
               .setTitle(`<:no:933239221836206131> This is a normal \`Default-Discord\` emoji!`)
               .setColor(ee.wrongcolor)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setFooter(es.footertext, es.footericon)
        message.channel.send({ embeds: [embed] })
      }
    } catch (e) {
      if (String(e).includes("DiscordAPIError: Maximum number of emojis reached (50)")) {
         const embed = new MessageEmbed()
               .setTitle(`${client.emojino} Maximum emoji count reached for this Server!`)
               .setColor(ee.wrongcolor)
      .setThumbnail(es.thumb ? es.footericon : null)
      .setFooter(es.footertext, es.footericon)
        
        return message.channel.send({ embeds: [embed] })

        if (client.settings.get(message.guild.id, `adminlog`) != "no") {
        try {
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if (!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null).setFooter(es.footertext, es.footericon)
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable6"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter("ID: " + message.author.id)
          ]})
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      }
    }
}
  }
}
