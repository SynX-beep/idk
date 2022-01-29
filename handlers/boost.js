const { MessageEmbed } = require("discord.js")

module.exports = client => {
  client.on("guildMemberUpdate", async (oldmember, newmember) => {
    const old = oldmember.premiumSince;
    const _new = newmember.premiumSince;
    const channel = client.settings.get(newmember.guild.id, "boostlogs.channel")
    if (!channel || channel == "no") return;
    console.log(channel)
    let message = client.settings.get(newmember.guild.id, "boostlogs.message")
    if (message == "deafult") {
      message = ":Server_Boosts~1: {member.mention} **Has Boosted Us**";
    } 
    console.log(message)
    const _message = message
      .split("{member.name}").join(newmember.user.username)
      .split("{guild.name}").join(newmember.guild.name)
      .split("{member.mention}").join("<@!" + newmember.id + ">")
    if (!old && _new) {
      client.channels.cache.get(channel.id).send({
        embeds: [
          new MessageEmbed()
            .setAuthor(newmember.user.tag, newmember.user.displayAvatarURL())
            .setColor("LUMINOUS_VIVID_PINK") 
            .setDescription(`${_message}`)
            .setFooter(`ID: ${newmember.user.id}`)
            .setTimestamp()
        ]
      }).catch(() => { })
    }
    if (old && !_new) {
      client.channel.cache.get(channel.id).send({
        embeds: [
          new MessageEmbed()
            .setAuthor(newmember.user.tag, newmember.user.displayAvatarURL())
            .setColor("RED") 
            .setDescription(`<a:Server_Boosts:933787999387390032> ${newmember.user.tag} **stopped Boosting us...**`)
            .setFooter(`ID: ${newmember.user.id}`)
            .setTimestamp()
        ]
      })
    }
  })
}