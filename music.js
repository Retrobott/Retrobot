const { Client, Util, MessageEmbed } = require("discord.js");
const client = new Client({
    disableEveryone: true
  })
const settings = require('./auth.json');
const ytdl = require("ytdl-core")
const YouTube = require('simple-youtube-api')
const youtube = new YouTube("AIzaSyBWwOH-fsqNEGCj3WXNIfDHVtcFfjKEOoI")

client.on("ready", () => {
    var customstats = [`${client.users.size} members!`, `${client.guilds.size} servers!`, `y!help | Yuuki v1.1`]
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(() => {
    client.user.setPresence({
        game: {
            name: customstats[Math.floor(Math.random() * customstats.length)],
            type: 'WATCHING'
        },
        status: 'online'
    })
    }, 8000);
  });

const queue = new Map()

var welcomechannel = []

var token = settings.token;
var prefix = settings.prefix;

var XD2 = [
    'https://media.tenor.com/images/08de7ad3dcac4e10d27b2c203841a99f/tenor.gif',
    'https://media.tenor.co/images/42922e87b3ec288b11f59ba7f3cc6393/raw',
    'https://media1.tenor.com/images/44b4b9d5e6b4d806b6bcde2fd28a75ff/tenor.gif'
  ]

var serverQueue = {}


/*client.on("guildMemberAdd", member => {
    const c = member.guild.channels.cache.find(channel => channel.id.includes(welcomechannel));
    if (!c) return;
   let embed = new MessageEmbed()
        .setImage(XD2[Math.floor(Math.random() * XD2.length)])
        .setDescription(`Welcome to the server, ${member}! Please enjoy your stay. Make sure to read the rules.`).setColor("RANDOM")
        c.send(embed);
});*/

client.on('message', async message => {
const serverQueue = queue.get(message.guild.id)
          var args = message.content.split(" ");
          var cmd = args[0].toLowerCase();

          const searchString = args.slice(1).join(" ");
          const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''

if (cmd == prefix + 'play') {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`You need to be in a voice channel to play music.`).setColor("#c21919")
    message.channel.send(embed);
    return;
    } else
    if (!args[1]) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`Please provide a link.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    } else {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            let embed = new MessageEmbed()
            .setTitle("Error!")
            .setDescription(`You need to be in a voice channel to play music.`).setColor("#c21919")
            message.channel.send(embed);
            return;
        }
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) {
            let embed = new MessageEmbed()
            .setTitle("Permission Error!")
            .setDescription(`I don't have permissions to connect to the voice channel.`).setColor("#c21919")
        message.channel.send(embed);
        return;
        }
        if (!permissions.has('SPEAK')) {
            let embed = new MessageEmbed()
            .setTitle("Permission Error!")
            .setDescription(`I don't have permissions to speak in the channel.`).setColor("#c21919")
        message.channel.send(embed);
        return;
        }
try {
            var video = await youtube.getVideoByID(url)
} catch {
  try {
      var videos = await youtube.searchVideos(searchString, 1)
      var video = await youtube.getVideoByID(videos[0].id)
  } catch {
    let embed = new MessageEmbed()
    .setTitle("Search Error!")
    .setDescription(`I couldn't find any search results.`).setColor("#c21919")
    message.channel.send(embed);
    return;
  }
}
           const song = {
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`
        }

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            }
            queue.set(message.guild.id, queueConstruct)
            queueConstruct.songs.push(song)

            try {
                var connection = await voiceChannel.join()
                queueConstruct.connection = connection
                play(message.guild, queueConstruct.songs[0])

            } catch (error) {
                console.log(`There was an error connecting to the voice channel: ${error}`)
                queue.delete(message.guild.id)
                let embed = new MessageEmbed()
                .setTitle("Error!")
                .setDescription(`There was an error connecting to the voice channel: ${error}`).setColor("#c21919")
            message.channel.send(embed);
            return;

            }

        } else {
            serverQueue.songs.push(song)
            let embed60 = new MessageEmbed()
                .setTitle("Added!")
                .setDescription(`**${song.title}** has been added to the queue.`).setColor("#19c222")
            message.channel.send(embed60);
        }
    }
} else if (cmd == prefix + 'stop') {
    if (!message.member.voice.channel) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`You need to be in a voice channel to stop the music.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    if (!serverQueue) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`There is nothing to play.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end()
    let embed = new MessageEmbed()
    .setTitle("Music Stopped!")
    .setDescription(`I have stopped the music for you.`).setColor("#19c222")
    message.channel.send(embed);
    return undefined
} else if (cmd == prefix + 'skip') {
    if (!message.member.voice.channel) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`You need to be in a voice channel to skip the music.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    if (!serverQueue) return message.channel.send("There is nothing playing.")
    serverQueue.connection.dispatcher.end()
    let embed = new MessageEmbed()
    .setTitle("Skipped!")
    .setDescription(`I have skipped the song.`).setColor("#19c222")
    message.channel.send(embed);
    return undefined
} else if (cmd == prefix + "volume") {
    if (!message.member.voice.channel){
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`You need to be in a voice channel to use music commands.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    if (!serverQueue) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`There is nothing playing.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    if (!args[1]) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`That volume is: **${serverQueue.volume}**.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    if (isNaN(args[1])) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`That is not a valid amount to change the volume.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    serverQueue.volume = args[1]
    serverQueue.connection.dispactcher.setVolumeLogarithmic(args[1] / 5)
    let embed = new MessageEmbed()
    .setTitle("Volume Changed!")
    .setDescription(`I have changed the volume to **${args[1]}**.`).setColor("#19c222")
    message.channel.send(embed);
    return undefined
} else if (cmd == prefix + "np") {
    if (!serverQueue) {
        let embed = new MessageEmbed()
        .setTitle("Error!")
        .setDescription(`There is nothing playing.`).setColor("#c21919")
        message.channel.send(embed);
        return;
    }
    let embed = new MessageEmbed()
    .setTitle("Playing!")
    .setDescription(`Now Playing: **${serverQueue.songs[0].title}**.`).setColor("#19c222")
    message.channel.send(embed);
    return undefined
} else if (cmd == prefix + "queue") {
    if (!serverQueue) return message.channel.send("There is nothing playing.")
    let embed50 = new MessageEmbed()
        .setTitle("Queue.")
        .setDescription(`
__**Song Queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now Playing:** ${serverQueue.songs[0].title}
`, { split: true }).setColor("#19c222")
message.channel.send(embed50);
return undefined
} else if (cmd == prefix + "pause") {
if(!message.member.voice.channel) {
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`You need to be in a voice channel to use the pause command.`).setColor("#c21919")
    message.channel.send(embed);
}
if(!serverQueue) {
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`There is nothing playing.`).setColor("#c21919")
    message.channel.send(embed);
}
if(!serverQueue.playing){
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`The music is already paused.`).setColor("#c21919")
    message.channel.send(embed);
}
serverQueue.playing = false
serverQueue.connection.dispatcher.pause()
let embed = new MessageEmbed()
.setTitle("Paused Music!")
.setDescription(`I paused the music for you.`).setColor("#19c222")
message.channel.send(embed);
return undefined
} else if (cmd == prefix + "resume") {
if(!message.member.voice.channel) {
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`You need to be in a voice channel to use the resume command.`).setColor("#c21919")
    message.channel.send(embed);
}
if(!serverQueue){
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`There is nothing playing.`).setColor("#c21919")
    message.channel.send(embed);
    return;
}
if(serverQueue.playing) {
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`The music is already playing.`).setColor("#c21919")
    message.channel.send(embed);
    return;
}
serverQueue.playing = true
serverQueue.connection.dispatcher.resume()
let embed = new MessageEmbed()
.setTitle("Resumed!")
.setDescription(`I resumed the music for you.`).setColor("#19c222")
message.channel.send(embed);
return undefined
} else if (cmd == prefix + "loop") {
if (!message.member.voice.channel) {
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`You need to be in a voice channel to use the loop command.`).setColor("#c21919")
    message.channel.send(embed);
    return;
}
if (!serverQueue){
    let embed = new MessageEmbed()
    .setTitle("Error!")
    .setDescription(`There is nothing playing.`).setColor("#c21919")
    message.channel.send(embed);
    return;
}

serverQueue.loop = !serverQueue.loop

let embed = new MessageEmbed()
.setTitle("Error!")
.setDescription(`I have now ${serverQueue.loop ?  `**Enabled**`: `**Disabled**`} loop.`).setColor("#19c222")
message.channel.send(embed);
return;
return undefined
}
})
function play(guild, song) {
const serverQueue = queue.get(guild.id)

if(!song){
serverQueue.voiceChannel.leave()
queue.delete(guild.id)
return
}
const dispactcher = serverQueue.connection.play(ytdl(song.url))
.on('finish', () => {
if (!serverQueue.loop) serverQueue.songs.shift()
play(guild, serverQueue.songs[0])
})
.on('error', error => {
console.log(error)
})
dispactcher.setVolumeLogarithmic(serverQueue.volume / 5)
let embed40 = new MessageEmbed()
    .setTitle("Playing.") //You can always have it randomize between 500.
    .setDescription(`Started playing **${song.title}**.`).setColor("#19c222") //time to test?
serverQueue.textChannel.send(embed40)
}

client.login(token);