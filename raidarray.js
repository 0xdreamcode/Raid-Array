const Discord = require('discord.js');
var request = require('request');

/*
  ID of target server.
  Make sure you have manually joined the account into this server.
*/
var targetID = '';

/*
  Target channel list
*/
var chans = [
  '',
]

/*
  Role IDs to not ping
*/
var avoidroleIDs = [
  ''
]
/*
  Account tokens. (NOT bot tokens)
*/
var tokens = [
]

/*
  Server you want to invite users to.
  Name and invite link.
*/
var msgconfig = {
  invite:`https://discord.gg/r5wsNf7`,
  inviteShort:`r5wsNf7`,
  name: '/trapan/',
  message: {
    text: `
    :warning: **ATTENTION** :warning:


    **{target_guildname}** is __shutting down!__

    > With all due regret we must inform you that the admins of __**{target_guildname}**__ have decided to shut the server down permanently in favor of a better server.

    > Here is your invite to the better alternative server:

    *Copy*&*paste* the code **{invite_short}** to access new server.
    `
  }
}

let clients = []
let seshs = []

var online = 0;
var offline = 0;

console.log('Logging in.')
tokens.forEach(t => {
  const client = new Discord.Client();

  client.on('ready', () => {
    online++;
    clients.push({
      token: t,
      client: client
    });

  });

  client.login(t).catch(e => {
    offline++;
  });
})

var halt = setInterval(() => {
  if (online + offline == tokens.length) {
    clearInterval(halt);
    console.log(`${online}/${tokens.length} logged in.`)

    doRaid(clients).then(r => {

    }).catch(e =>
    {
      console.log(e)
    })
  }
}, 100)

function doRaid(clients) {

  return new Promise((resolve, reject) => {

    let guild;
    clients.forEach(c => {
      var gg = c.client.guilds.get(targetID)
      console.log
      if (gg)
        guild = gg;
    })
    if (!guild)
    {
      reject('All instances banned.')
      return;
    }
    console.log(`Target server: ${guild}`)
    console.log(`${chans.length} channels`)

    console.log('\nRaid initiated!')

    var timeout = 2000;
    var i = 0;

    clients.forEach(c => {

        setTimeout((client) => {
          var sesh = setInterval((client) => {

            var bot = client.client

            var guild = bot.guilds.get(targetID)
            if (!guild)
            {
              console.log(`${bot.user.username} guild null.`)
              clearTimeout(sesh)
              return;
            }

            chans.forEach(ch => {

              var chan = guild.channels.get(ch)
              if (!chan)
                return;


              var memb = chan.members.filter(m => {
                  var avoid = false;
                  avoidroleIDs.forEach(rid => {
                    if (m.roles.has(rid)) avoid = true;
                  })
                  return !avoid;
                }).array()

              var pingMsg = '';
              for (var i = 0; i < 4; i++) {
                var rusr = `${memb[Math.floor(Math.random()*memb.length)]}`;
                pingMsg += rusr;
              }

              var formattedText = msgconfig.message.text
              .replace(/{target_guildname}/g, chan.guild.name)
              .replace(/{invite_short}/g, msgconfig.inviteShort)

              while(true)
              {
                if ( (pingMsg + formattedText + '\n.').length >= 2000 ) break;

                pingMsg += '\n.'
              }
              pingMsg += formattedText

              var emb = new Discord.RichEmbed()
                .setColor('#ff66ff')
                .setTitle(`${chan.guild.name} is shutting down!`)
                .setURL(msgconfig.invite)
                .setAuthor(`Emergency message!`, 'http://icons.iconarchive.com/icons/webalys/kameleon.pics/256/Love-Letter-icon.png', msgconfig.invite)
                .setDescription(`
                  With all due regret we must inform you that the admins of __**${chan.guild.name}**__ have decided to shut the server down permanently in favor of a better server.
                  `)
                .addField('Invite', `
                Here is your invite to the better alternative server, [🔞 __**${msgconfig.name}**__ 🔞](${msgconfig.invite})! Click to join.
                `)
                //.setThumbnail(h.iconURL)
                //.addField('Okay?', ``)
                /*
                .addField('Members', `
                **${h.presences.array().length} online**.
                ${h.memberCount} total.
                `, true) */
                .setImage('https://i.imgur.com/PWsW2pG.png')
                .setTimestamp()
                .setFooter('from the Dark Overlord', 'http://icons.iconarchive.com/icons/webalys/kameleon.pics/256/Love-Letter-icon.png')
                .addField(`About the new server`, `
                    • Always new members.
                    • Original content.
                    • [Our own website](https://trapan.net).
                    • Invite ranks.
                  `, true)
                  .addField(`Special roles`, `
                      If you post pictures of yourself (selfies or lewds) you can get a special role called ***Good Girl*** or ***Good Boy*** depending on your gender preference.
                    `, true)
                  .addBlankField()
                  .addField(`JOIN NOW!`, `

                    [**Invite link: ${msgconfig.name}**\t~\t${msgconfig.invite}](${msgconfig.invite})

                    [**Invite link: ${msgconfig.name}**\t~\t${msgconfig.invite}](${msgconfig.invite})

                    [**Invite link: ${msgconfig.name}**\t~\t${msgconfig.invite}](${msgconfig.invite})

                   `)


              chan.send(pingMsg, {embed: emb}).then(m => {
                console.log(`${m.author.username} -> #${m.channel.name}`)
                //console.log(m)
              }).catch(e => {
                //console.log(e);
                console.log(`${c.username}: ${e}`)
                clearTimeout(sesh)

              })
            })
          }, timeout, client)

          seshs.push(sesh);

          i++;
        }, i * timeout, c);
    })
  })
}
