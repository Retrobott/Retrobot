if (!process.env.production) require('dotenv').config();
const { MessageEmbed, BroadcastDispatcher, MessageReaction, MessageCollector } = require('discord.js');
const Discord = require('Discord.js');
const { error } = require('winston');
const bot = new Discord.Client();

const { Welcome } = require('./Welcome/Welcome.js')

const { prefix } = require('./auth.json'),
  { token } = process.env;

const canvas = require('canvas');

const revivalcooldown = new Set();

const pingedRecently = new Set();

const partnerRecently = new Set();

const introRecently = new Set();

const fs = require('fs');


function catchErr(err, message){
  message.author.send("An error occured while using this command!" + "```" + err + "```");
}


bot.enabledisable = require("./enableDisable.json");

bot.on("error", () => { bot.login(token) });

let userIntroduction = {}
let userApplications = {}
let userApplications2 = {}
let userApplications3 = {}
let suggestion = {}
let confession = {}

var userTickets = new Map();

let servers = {};

bot.on("message", message => {
 
  
  if(message.content === "/revive"){
   // return message.channel.send("This command is currently disabled due to improper use.");
 
 if(!message.member.roles.cache.has('773967348800421888'))
  if(!message.member.roles.cache.has('787773405977247754'))
  return message.channel.send("This command is exclusively for Known Members, feel free to use the /known command for more info!");
    if(revivalcooldown.has(message.guild.id)) return message.channel.send("The command is under cooldown!");
    revivalcooldown.add(message.guild.id);
    message.channel.send(`${message.author} just used a <@&769256855851499602>!`);
    setTimeout(() => {
      revivalcooldown.delete(message.guild.id);
    }, 10800000);

  }
  
});


bot.on("message", (message) => {
  if(message.content === '/disableapplications'){
    if(!message.member.roles.cache.has('769049952272777216')) return message.channel.send("You don't have the permission to use this command.");
    bot.enabledisable [message.guild.id] = {
      disabled: true
    }
    fs.writeFile("./enableDisable.json", JSON.stringify(bot.enabledisable, null, 4), err => {
      if(err) throw err;

      return message.channel.send("Applications have been disabled.");   
  });
}
    if(message.content === '/enableapplications'){
      if(!message.member.roles.cache.has('769049952272777216')) return message.channel.send("You don't have the permission to use this command.");
      bot.enabledisable [message.guild.id] = {
        disabled: false
      }
      fs.writeFile("./enableDisable.json", JSON.stringify(bot.enabledisable, null, 4), err => {
        if(err) throw err;
  
        return message.channel.send("Applications have been enabled.");   
    });
  }

});

bot.on("ready", () => {
  console.log("Bot is online!");
  

  canvas.registerFont('Verdana.ttf', {family: 'Verdana'});
  canvas.registerFont('pwmsa.ttf', {family: 'pwmsa'});
  canvas.registerFont('Shrikhand.ttf', {family: 'Shrikhand'});
  let chnlID = '867132853266677770';
  let msgID = '867440420832280588';
  bot.channels.cache.get(chnlID).messages.fetch(msgID, true, false);
})



bot.on("messageReactionAdd", function(reaction, user) {
  if (user.equals(bot.user)) return;
  let msgID = '867440420832280588'; // id of the message to react to 
  let introchannelID = '867108134223740948'; // Id of the channel to send embeds to
  if (reaction.message.id != msgID) return;
  let guildMember = reaction.message.guild.member(user);
  if (reaction.emoji.name != '👋') return;
  reaction.remove();
  reaction.message.react('👋');
  let authorId = user.id;
  function delIntro(res) {
    delete userIntroduction[authorId];
    return user.send('Introduction has been cancelled!')
  }
// Turning /applyA into /introduction
    if (introRecently.has(user.id))
    return user.send(`You can't send another introduction yet!`);
      console.log(`Introduction begin for authorId ${authorId}`);
      // User is not already in a registration process    
      if (!(authorId in userIntroduction)) {
        userIntroduction[authorId] = {};
          let authorIntroduction = userIntroduction[authorId];
          // console.log(userIntroduction);
          userIntroduction[authorId] = { "step" : 1}
          user.send("```Welcome to your guided introduction process. Please follow the instructions and answer the questions as neatly and honestly as possible. If at any point you'd like to cancel, please type the command /deleteintro```\n\n");
          user.send("**What is your name?**").then((c) => {
            let ch = c.channel;
            const fil = (m) => m.author.id == user.id;
            const col1 = new Discord.MessageCollector(ch, fil, 1);
              col1.on('collect', (res1) => {
                col1.stop();
                if (res1.content.startsWith('/deleteintro')) return delIntro();
                authorIntroduction.step = 2;
                authorIntroduction.answer1 = res1.content;
                user.send('**What are some of your hobbies/interests?**')
                const col2 = new Discord.MessageCollector(ch, fil, 1);
                col2.on('collect', (res2) => {
                  col2.stop();
                  if (res2.content.startsWith('/deleteintro')) return delIntro();
                  authorIntroduction.answer2 = res2.content;
                  authorIntroduction.step = 3;
                  user.send('**Where do you live? (If not comfortable you may put \'hidden\' or \'no\')**')
                  const col3 = new Discord.MessageCollector(ch, fil, 1);
                  col3.on('collect', (res3) => {
                    col3.stop();
                    if (res3.content.startsWith('/deleteintro')) return delIntro();
                    authorIntroduction.answer3 = res3.content;
                    authorIntroduction.step = 4;
                    user.send('**Write a bit about yourself down below (about me)**');
                    const col4 = new Discord.MessageCollector(ch, fil, 1);
                    col4.on('collect', (res4) => {
                      col4.stop();
                      if (res4.content.startsWith('/deleteintro')) return delIntro();
                      authorIntroduction.answer4 = res4.content;
                      user.send('*All done! Feel free to check out your introduction in* <#867108134223740948>!');
                      const introem = new Discord.MessageEmbed()
            .setTitle(`Introduction`)
            .setDescription(`Written by: ${user.username} (${user})`)
            .addFields(
              { name: 'Name:', value: `${authorIntroduction.answer1}`, inline: true},
              { name: 'Location:', value: `${authorIntroduction.answer3}`, inline: true},
              { name: '\u200B', value: `\u200B`, inline: true},
              { name: 'Hobbies:', value: `${authorIntroduction.answer2}`, inline: false},
              { name: 'About me:', value: `${authorIntroduction.answer4}`, inline: false}
              //deleting questions below (done)
            )
            .setImage(user.avatarURL())
            .setTimestamp()
            .setFooter("Check pinned messages to post your own introduction!")
            .setColor("4B88E4")

              bot.channels.cache.get("867108134223740948")
                .send(`${user}`);
              bot.channels.cache.get("867108134223740948")
                .send(introem)
                .then(message => {
 
              delete userIntroduction[authorId];
              //sandwich cd
              introRecently.add(user.id);
              setTimeout(() => {
			          introRecently.delete(user.id);
              }, 172800000);
                })
                    })
                  })
                })
            })
          })
 
      } else {
        return user.send('You already have an active Introduction, Finish it first!')
      }
});


bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  let authorId = message.author.id;
  if(message.content === "/cancelapp"){
    delete userApplications[authorId];
    return message.channel.send("Application process has been cancelled!");
  }

  
  if (message.content === "/applyA") {
    if(bot.enabledisable[message.guild.id].disabled === true) return message.channel.send("Sorry, applications are currently closed now!");
      console.log(`Apply begin for authorId ${authorId}`);
      message.channel.send("Application process has started, please check your DMs!");
      // User is not already in a registration process    
      if (!(authorId in userApplications)) {
          userApplications[authorId] = { "step" : 1}

          message.author.send("*Welcome to your guided application process for Chat staff. Please follow the instructions and answer the questions as neatly and honestly as possible. If you change your mind about submitting the application and want to cancel it, please type ``/cancelapp``*\n\n");
          message.author.send("**Why do you want to be a staff member?**");
      }

  } else {

      if (message.channel.type === "dm" && authorId in userApplications) {
          let authorApplication = userApplications[authorId];

          if (authorApplication.step == 1 ) {
              authorApplication.answer1 = message.content;
              message.author.send("**Do you have any experience in moderating a Discord server?**");
              authorApplication.step ++;
          }
          else if (authorApplication.step == 2) {
              authorApplication.answer2 = message.content;
              message.author.send("**How long have you been a part of the server?**");
              authorApplication.step ++;
          }
          else if (authorApplication.step == 3) {
              authorApplication.answer3 = message.content;
              message.author.send("**How active are you in the chats? (Text and voice)**");
              authorApplication.step ++;
          }

          else if (authorApplication.step == 4) {
              authorApplication.answer4 = message.content;
              message.author.send("**What do you think could be improved in the community?**");
              authorApplication.step ++;
          }
          else if (authorApplication.step == 5) {
            authorApplication.answer5 = message.content;
            message.author.send("**Let's say two members are having a disagreement, but one of the members is your friend. What action do you take?**");
            authorApplication.step ++;
        }
          else if (authorApplication.step == 6) {
            authorApplication.answer6 = message.content;
            message.author.send("**You see another staff member abusing their power. What course of action do you take?**");
            authorApplication.step ++;
        }
          else if (authorApplication.step == 7) {
            authorApplication.answer7 = message.content;
            message.author.send("**Why do you think we should chose you over other applicants?**");
            authorApplication.step ++;
        }
          else if (authorApplication.step == 8) {
            authorApplication.answer8 = message.content;
            message.author.send("**Is there anything else you'd like to tell us about yourself?**");
            authorApplication.step ++;
          }
          else if (authorApplication.step == 9) {
            authorApplication.answer9 = message.content;
            message.author.send("*Thank you very much for applying! The staff has now received your application and if accepted you will be followed up within 24 hours.*");



            const appem = new Discord.MessageEmbed()
            .setTitle(`An application has been submitted:`)
            .setDescription(`Application by: ||${message.author.username} (${message.author})||`)
            .addFields(
              { name: '1. Why do you want to be a staff member?', value: `${authorApplication.answer1}`},
              { name: '2. Do you have any experience in moderating a Discord server?', value: `${authorApplication.answer2}`},
              { name: '3. How long have you been a part of the server?', value: `${authorApplication.answer3}`},
              { name: '4. How active are you in the chats? (Text and voice)', value: `${authorApplication.answer4}`},
              { name: '5. What do you think could be improved in the community?', value: `${authorApplication.answer5}`},
              { name: "6. Let's say two members are having a disagreement, but one of the members is your friend. What action do you take?", value: `${authorApplication.answer6}`},
              { name: '7. You see another staff member abusing their power. What course of action do you take?', value: `${authorApplication.answer7}`},
              { name: '8. Why do you think we should chose you over other applicants?', value: `${authorApplication.answer8}`},
              { name: "9. Is there anything else you'd like to tell us about yourself?", value: `${authorApplication.answer9}`}

            )
            .setTimestamp()
            .setFooter("Please react below to cast your votes.")
            .setColor("F67280")

            //

              bot.channels.cache.get("769094431151882260")
                .send(`<@&769094800904552489>`);
              bot.channels.cache.get("769094431151882260")
                .send(appem)
                .then(message => {
                  message.react("✅");
                  message.react("❎");
                })
              delete userApplications[authorId];
              
          }
      }
  }


});




bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  let authorId = message.author.id;


if (message.content === "/applyB") {
  if(bot.enabledisable[message.guild.id].disabled === true) return message.channel.send("Sorry, applications are currently closed now!");
  console.log(`Apply begin for authorId ${authorId}`);
  message.channel.send("Application process has started, please check your DMs!");
  // User is not already in a registration process    
  if (!(authorId in userApplications2)) {
      userApplications2[authorId] = { "step" : 1}

      message.author.send("```Welcome to your guided application process for Event Staff. Please follow the instructions and answer the questions as neatly and honestly as possible.```\n\n");
      message.author.send("**Why do you want to be a part of the event staff?**");
  }

} else {

  if (message.channel.type === "dm" && authorId in userApplications2) {
      let authorApplication2 = userApplications2[authorId];

      if (authorApplication2.step == 1 ) {
          authorApplication2.answer1 = message.content;
          message.author.send("**What do you think is lacking in our current events?**");
          authorApplication2.step ++;
      }
      else if (authorApplication2.step == 2) {
          authorApplication2.answer2 = message.content;
          message.author.send("**What kind of events can you offer to the server?**");
          authorApplication2.step ++;
      }
      else if (authorApplication2.step == 3) {
          authorApplication2.answer3 = message.content;
          message.author.send("**Do you consider yourself good with large groups of people?**");
          authorApplication2.step ++;
      }

      else if (authorApplication2.step == 4) {
          authorApplication2.answer4 = message.content;
          message.author.send("**How often do you see yourself hosting events?**");
          authorApplication2.step ++;
      }
      else if (authorApplication2.step == 5) {
        authorApplication2.answer5 = message.content;
        message.author.send("**What do you feel makes you stand out from other applicants?**");
        authorApplication2.step ++;
    }
      else if (authorApplication2.step == 6) {
        authorApplication2.answer6 = message.content;
        message.author.send("**Is there anything else you'd like to tell us about yourself?**");
        authorApplication2.step ++;
      }

        else if (authorApplication2.step == 7) {
          authorApplication2.answer7 = message.content;
          message.author.send("*Thank you very much for applying! The staff has now received your application and if accepted you will be followed up within 24 hours.*");


          const appem2 = new Discord.MessageEmbed()
            .setTitle(`An application has been submitted:`)
            .setDescription(`Application by: ||${message.author.username} (${message.author})||`)
            .addFields(
              { name: '1. Why do you want to be a part of the event staff?', value: `${authorApplication2.answer1}`},
              { name: '2. What do you think is lacking in our current events?', value: `${authorApplication2.answer2}`},
              { name: '3. What kind of events can you offer to the server?', value: `${authorApplication2.answer3}`},
              { name: '4. Do you consider yourself good with large groups of people?', value: `${authorApplication2.answer4}`},
              { name: '5. How often do you see yourself hosting events?', value: `${authorApplication2.answer5}`},
              { name: "6. What do you feel makes you stand out from other applicants?", value: `${authorApplication2.answer6}`},
              { name: "7. Is there anything else you'd like to tell us about yourself?", value: `${authorApplication2.answer7}`}

            )
            .setTimestamp()
            .setFooter("Please react below to cast your votes.")
            .setColor("F67280")

              bot.channels.cache.get("769094431151882260")
                .send(`<@&769094800904552489>`);
              bot.channels.cache.get("769094431151882260")
                .send(appem2)
                .then(message => {
                  message.react("✅");
                  message.react("❎");
                })
              delete userApplications2[authorId];
        
      }
  }
}
});


bot.on("message", function(message) {

  if (message.author.equals(bot.user)) return;

  let authorId = message.author.id;

  if (message.content === "/applyC") {
    if(bot.enabledisable[message.guild.id].disabled === true) return message.channel.send("Sorry, applications are currently closed now!");
      console.log(`Apply begin for authorId ${authorId}`);
      message.channel.send("Application process has started, please check your DMs!");
      // User is not already in a registration process    
      if (!(authorId in userApplications3)) {
          userApplications3[authorId] = { "step" : 1}

          message.author.send("```Welcome to your guided application process for Chat staff. Please follow the instructions and answer the questions as neatly and honestly as possible.```\n\n");
          message.author.send("**Why are you interested in becoming a partnership manager?**");
      }

  } else {

      if (message.channel.type === "dm" && authorId in userApplications3) {
          let authorApplication3 = userApplications3[authorId];

          if (authorApplication3.step == 1 ) {
              authorApplication3.answer1 = message.content;
              message.author.send("**What are the server's requirements for partnership?**");
              authorApplication3.step ++;
          }
          else if (authorApplication3.step == 2) {
              authorApplication3.answer2 = message.content;
              message.author.send("**How would you go about forming a partnership with another server?**");
              authorApplication3.step ++;
          }
          else if (authorApplication3.step == 3) {
              authorApplication3.answer3 = message.content;
              message.author.send("**You message an owner and/or another partnership manager interested in partnering servers. You get no response for a day, what do you do?**");
              authorApplication3.step ++;
          }

          else if (authorApplication3.step == 4) {
              authorApplication3.answer4 = message.content;
              message.author.send("**What pings should you use when posting a new partnership?**");
              authorApplication3.step ++;
          }
          else if (authorApplication3.step == 5) {
            authorApplication3.answer5 = message.content;
            message.author.send("**What kind of servers should we be partnering with?**");
            authorApplication3.step ++;
        }
          else if (authorApplication3.step == 6) {
            authorApplication3.answer6 = message.content;
            message.author.send("**What do you feel makes you more fit for this position than other applicants?**");
            authorApplication3.step ++;
        }
          else if (authorApplication3.step == 7) {
            authorApplication3.answer7 = message.content;
            message.author.send("**Is there anything else you'd like to tell us about yourself?**");
            authorApplication3.step ++;
          }

          else if (authorApplication3.step == 8) {
            authorApplication3.answer8 = message.content;
            message.author.send("*Thank you very much for applying! The staff has now received your application and if accepted you will be followed up within 24 hours.*");



            const appem3 = new Discord.MessageEmbed()
            .setTitle(`An application has been submitted:`)
            .setDescription(`Application by: ||${message.author.username} (${message.author})||`)
            .addFields(
              { name: '1. Why are you interested in becoming a partnership manager?', value: `${authorApplication3.answer1}`},
              { name: "2. What are the server's requirements for partnership?", value: `${authorApplication3.answer2}`},
              { name: '3. How would you go about forming a partnership with another server?', value: `${authorApplication3.answer3}`},
              { name: '4. You message an owner and/or another partnership manager interested in partnering servers. You get no response for a day, what do you do?', value: `${authorApplication3.answer4}`},
              { name: '5. What pings should you use when posting a new partnership?', value: `${authorApplication3.answer5}`},
              { name: "6. What kind of servers should we be partnering with?", value: `${authorApplication3.answer6}`},
              { name: "7. What do you feel makes you more fit for this position than other applicants?", value: `${authorApplication3.answer7}`},
              { name: "8. Is there anything else you'd like to tell us about yourself?", value: `${authorApplication3.answer8}`}

            )
            .setTimestamp()
            .setFooter("Please react below to cast your votes.")
            .setColor("F67280")

              bot.channels.cache.get("769094431151882260")
                .send(`<@&769094800904552489>`);
              bot.channels.cache.get("769094431151882260")
                .send(appem3)
                .then(message => {
                  message.react("✅");
                  message.react("❎");
                })
              delete userApplications3[authorId];
            
          }
      }
  }


});

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  let authorId = message.author.id;

  if (message.content === "suggest") {
      console.log(`Suggestion made`);
      // User is not already in a registration process    
      if (!(authorId in suggestion)) {
          suggestion[authorId] = { "step" : 1}

          message.author.send("***Disclaimer: Suggesstions will be logged in a private 'admin-only' channel for strictly moderation purposes.***\n\nPlease type out the **title** for the suggestion. \n Suggesstion regarding.....");
          
      }

  } else {

      if (message.channel.type === "dm" && authorId in suggestion) {
          let authorsug = suggestion[authorId];

          if (authorsug.step == 1 ) {
              authorsug.answer1 = message.content;
              message.author.send("Great! Now please type in the message for suggestion below: ");
              authorsug.step ++;
          }
          else if (authorsug.step == 2) {
              authorsug.answer2 = message.content;
              message.author.send("Thank you for submitting your suggestion.");
              authorsug.step ++;

              const suggestchannel = bot.channels.cache.get("769050450992431144");

              const suggestionem = new Discord.MessageEmbed()
              .setTitle(`Suggestion regarding "${authorsug.answer1}"`)
              .setDescription(authorsug.answer2)
              .setColor("#737373")
			  .setTimestamp()

              suggestchannel.send(suggestionem);

              const suggestionlogem = new Discord.MessageEmbed()
              .setTitle(`Suggestion regarding "${authorsug.answer1}"`)
              .setDescription(`${authorsug.answer2}\n\n Suggestion made by: ${message.author.username} [${message.author}]`)
              .setColor("#737373")
			  .setTimestamp()
              

              const logchannel = bot.channels.cache.get("769094324843184149");

              logchannel.send(suggestionlogem);





              delete suggestion[authorId];


          }
        }
      }
});

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  let authorIdC = message.author.id;

  if (message.content === "/confess") {
      console.log(`Confession made`);
      // User is not already in a registration process    
      if (!(authorIdC in confession)) {
          confession[authorIdC] = { "step" : 1}

          message.author.send("```Disclaimer: Confessions will be logged in a private 'admin-only' channel for strictly moderation purposes. Under no circumstances will we give out your identity.```\n\n*Please type out your confession below:*");
          
      }

  } else {

      if (message.channel.type === "dm" && authorIdC in confession) {
          let authorconf = confession[authorIdC];

          if (authorconf.step == 1 ) {
              authorconf.answer1 = message.content;
              message.author.send("Your confession has been succesfully submitted to <#867132707859726363>!");
              authorconf.step ++;
          }

              const confchannel = bot.channels.cache.get("867132707859726363");

              const confem = new Discord.MessageEmbed()
              .setTitle(`Confession`)
              .setDescription(authorconf.answer1)
              .setColor("#8e3eb3")
			  .setTimestamp()

              confchannel.send(confem);

              const conflogem = new Discord.MessageEmbed()
              .setTitle(`Confession`)
              .setDescription(`${authorconf.answer1}\n\n Confession made by: ||${message.author.username} [${message.author}]||`)
              .setColor("#737373")
			  .setTimestamp()
              

              const clogchannel = bot.channels.cache.get("769052479554846781");

              clogchannel.send(conflogem);





              delete confession[authorIdC];


          }
      }
});

bot.snipes = new Map();
bot.esnipes = new Map()

bot.on("messageDelete", function (message, channel) {
  bot.snipes.set(message.channel.id, {
      content: message.content,
      authortag: message.author.tag,
      author: message.author
  });

  });

bot.on('message', message => {

    let args = message.content.substring(prefix.length).split(" ");
    if(message.author.bot) return;

    if(!message.content.startsWith(prefix)) return;
	
	try{


    switch(args[0]){
		
		case 'sendmessage':
			if(!message.author.id === "331401818619772928") return;
			if(!args[1]) return message.channel.send("No destination input.")
			if(!args[2]) return message.channel.send("No message input.")

			messageDest = bot.channels.cache.get(args[1]);
			let messageContent = args.splice(2).join(" ")
			

			messageDest.send(messageContent);

			message.channel.send(`Message sent to ${messageDest}.`);


      break;

      case 'snipe':
        const msg = bot.snipes.get(message.channel.id);
        if(!msg) return message.channel.send("Nothing to snipe!");

        const snipeembed = new Discord.MessageEmbed()
        .setAuthor(msg.authortag)
        .setDescription(msg.content)
        .setThumbnail(msg.author.avatarURL())

        message.channel.send(snipeembed)
      break;

      case 'esnipe':
        const emsg = bot.esnipes.get(message.channel.id);
        if(!emsg) return message.channel.send("Nothing to snipe!");

        const esnipeembed = new Discord.MessageEmbed()
        .setAuthor(emsg.authortag)
        .setDescription(emsg.content)
        .setThumbnail(emsg.author.avatarURL())

        message.channel.send(esnipeembed);
      break;

      case 'ping':
        message.channel.send("Pong!");
      break;

        case 'confess':

          if(message.channel.type === "dm") {

            if(!args[1]) return;
            message.channel.send("There is a new confessions system! Please type only the command `/confess` to continue.")
            /*

            Shaf's first code <3

            let say = args.splice(1).join(" ")
    
            const confession = new Discord.MessageEmbed()
            .setTitle('Confession')
            .setDescription(say)
            .setTimestamp()
            .setColor("#8e3eb3")
    
            const channel = bot.channels.cache.get('769050473822027847');
            
            var log = `||**${message.author.username}**(${message.author})|| confessed: \n\n ${message.content}`;

            const logs = bot.channels.cache.get('769052479554846781');
            
            const logconfess = new Discord.MessageEmbed()
            .setTitle('Confession log')
            .setDescription(log)
            .setTimestamp()
            .setColor("#006400")
            .setFooter(`User's ID is ${message.author.id}`)

            logs.send(logconfess);
                
    
    
            channel.send(confession)

            message.author.send("Confession submitted!");
            */
          }
    
            break;
            case 'hug':
            if(!args[1]) return message.channel.send("Mention a user to hug!");
                var hugcol = [
                    "https://acegif.com/wp-content/uploads/anime-hug.gif",
                    "https://media0.giphy.com/media/l2QDM9Jnim1YVILXa/200.gif",
                    "https://media1.tenor.com/images/63f37cdce7bdc233c7186c2b91e9810c/tenor.gif?itemid=16038267",
                    "https://media1.giphy.com/media/lrr9rHuoJOE0w/giphy.gif",
                    "https://media1.tenor.com/images/969f0f462e4b7350da543f0231ba94cb/tenor.gif?itemid=14246498",
                    "https://cdn.lowgif.com/small/66af32a828a3fa7d-.gif",
                    "https://media1.tenor.com/images/94989f6312726739893d41231942bb1b/tenor.gif?itemid=14106856",
                    "https://media1.tenor.com/images/506aa95bbb0a71351bcaa753eaa2a45c/tenor.gif?itemid=7552075",
                    "https://media1.tenor.com/images/c9e2e21f4eedd767a72004e4ab521c9d/tenor.gif?itemid=13576064",
                    "https://media1.tenor.com/images/16b700192566c28d564a24b7f6fe6703/tenor.gif?itemid=15501990",
                    "https://media1.tenor.com/images/86e217b0915b3368d48eedeba0d8b68c/tenor.gif?itemid=13221036",
                    "https://media1.tenor.com/images/53c1172d85491e363ce58b20ba83cdab/tenor.gif?itemid=14903952",
                    "https://media1.tenor.com/images/8f28a9d7097b811950b85ff6d561eb55/tenor.gif?itemid=18169149",
                    "https://archive-media-0.nyafuu.org/c/image/1567/24/1567247961428.gif"
    
    
                
                  ]
                  
                  var hugrand = hugcol[Math.floor(Math.random() * hugcol.length)];
    
                const hugem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} hugged ${message.mentions.users.first().username}`)
                .setImage(hugrand)
                .setColor("b39eb5")
    
                message.channel.send(hugem);
                break;
                case 'bully':
            if(!args[1]) return message.channel.send("Mention a user to bully!");
                var bullycol = [
                    "https://media1.tenor.com/images/d8eb944ec458745740bf455cc6d50c9f/tenor.gif?itemid=12354084",
                    "https://media1.tenor.com/images/cd4e555c2f9e0a269c4bc556c26bad85/tenor.gif?itemid=14116420",
                    "https://media1.tenor.com/images/608fcf3bb559a51dcea46e6f244a32d8/tenor.gif?itemid=5600466",
                    "https://i.imgur.com/g005tMV.gif",
                    "https://imgur.com/N10WUeF.gif",
                    "https://imgur.com/eP7NKy7.gif",
                    "https://imgur.com/3SsZUVT.gif",
                    "https://imgur.com/jI8zhH6.gif",
                    "https://imgur.com/pO2smzw.gif",
                    "https://imgur.com/a3upumA.gif"
    
    
                
                  ]
                  
                  var bullyrand = bullycol[Math.floor(Math.random() * bullycol.length)];
    
                const bullyem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} is bullying ${message.mentions.users.first().username}! `)
                .setImage(bullyrand)
                .setColor("b39eb5")
    
                message.channel.send(bullyem);
                break;
            case 'kiss':
            if(!args[1]) return message.channel.send("Mention a user to kiss!");
                var kisscol = [
                    "https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865",
                    "https://i.pinimg.com/originals/2b/52/71/2b5271e20fa65925e07d0338fa290135.gif",
                    "https://media0.giphy.com/media/FqBTvSNjNzeZG/source.gif",
                    "https://media2.giphy.com/media/G3va31oEEnIkM/200.gif",
                    "https://media1.tenor.com/images/503bb007a3c84b569153dcfaaf9df46a/tenor.gif?itemid=17382412",
                    "https://media1.tenor.com/images/ea9a07318bd8400fbfbd658e9f5ecd5d/tenor.gif?itemid=12612515",
                    "https://media1.tenor.com/images/7fd98defeb5fd901afe6ace0dffce96e/tenor.gif?itemid=9670722",
                    "https://media1.tenor.com/images/f5167c56b1cca2814f9eca99c4f4fab8/tenor.gif?itemid=6155657",
                    "https://media1.tenor.com/images/02d9cae34993e48ab5bb27763d5ca2fa/tenor.gif?itemid=4874618",
                    "https://media1.tenor.com/images/d0cd64030f383d56e7edc54a484d4b8d/tenor.gif?itemid=17382422",
                    "https://media1.tenor.com/images/d307db89f181813e0d05937b5feb4254/tenor.gif?itemid=16371489",
                    "https://media1.tenor.com/images/558f63303a303abfdddaa71dc7b3d6ae/tenor.gif?itemid=12879850",
                    "https://media1.tenor.com/images/8513ffbc460cd8ebcffe3026a722e84f/tenor.gif?itemid=18088731",
                    "https://media1.tenor.com/images/9dc7618084bcde2bb603a112b846f8b0/tenor.gif?itemid=19445519"
    
    
                
                  ]
                  
                  var kissrand = kisscol[Math.floor(Math.random() * kisscol.length)];
    
                const kissem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} kissed ${message.mentions.users.first().username}`)
                .setImage(kissrand)
                .setColor("b39eb5")
    
                message.channel.send(kissem);
                break;
            case 'pat':
            if(!args[1]) return message.channel.send("Mention a user to pat!");
                var patcol = [
                    "https://media1.tenor.com/images/da8f0e8dd1a7f7db5298bda9cc648a9a/tenor.gif?itemid=12018819",
                    "https://i.pinimg.com/originals/2e/27/d5/2e27d5d124bc2a62ddeb5dc9e7a73dd8.gif",
                    "https://media1.tenor.com/images/6151c42c94df654b1c7de2fdebaa6bd1/tenor.gif?itemid=16456868",
                    "https://media1.tenor.com/images/d7c326bd43776f1e0df6f63956230eb4/tenor.gif?itemid=17187002",
                    "https://media1.tenor.com/images/e5fff7bc2fc641f8ed0cba92475ea741/tenor.gif?itemid=18243417",
                    "https://media1.tenor.com/images/90712ed3a99db973ec92383a3c6a8767/tenor.gif?itemid=14043105",
                    "https://media1.tenor.com/images/f5176d4c5cbb776e85af5dcc5eea59be/tenor.gif?itemid=5081286",
                    "https://media1.tenor.com/images/6ee188a109975a825f53e0dfa56d497d/tenor.gif?itemid=17747839",
                    "https://media1.tenor.com/images/57e98242606d651cc992b9525d3de2d8/tenor.gif?itemid=17549072",
                    "https://media1.tenor.com/images/55df4c5fb33f3cd05b2f1ac417e050d9/tenor.gif?itemid=6238142",
                    "https://media1.tenor.com/images/c0bcaeaa785a6bdf1fae82ecac65d0cc/tenor.gif?itemid=7453915",
                    "https://media1.tenor.com/images/63924d378cf9dbd6f78c2927dde89107/tenor.gif?itemid=15049549",
                    "https://media1.tenor.com/images/21d3876b9322bada38283a4722cee1a5/tenor.gif?itemid=18861591",
                    "https://media1.tenor.com/images/37b0ba8252f8698d23c83d889768540b/tenor.gif?itemid=19580650",
                    "https://media1.tenor.com/images/220babfd5f8b629cc16399497ed9dd96/tenor.gif?itemid=6130861",
                    "https://data.whicdn.com/images/295195659/original.gif",
                    "https://i.imgur.com/LUypjw3.gif"
    
    
                
                  ]
                  
                  var patrand = patcol[Math.floor(Math.random() * patcol.length)];
    
                const patem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} patted ${message.mentions.users.first().username}`)
                .setImage(patrand)
                .setColor("b39eb5")
    
                message.channel.send(patem);
                break;
				
			case 'blush':
                if(!args[1]){
                  var blushcol = [
                    "https://media1.tenor.com/images/cbfd2a06c6d350e19a0c173dec8dccde/tenor.gif?itemid=15727535",
					"https://cdn.discordapp.com/attachments/711227582535696466/711230142831132753/95soD6bNkww.gif",
					"https://cdn.weeb.sh/images/SJkffIXw-.gif",
					"https://cdn.weeb.sh/images/r19GfI7vW.gif",
					"https://cdn.discordapp.com/attachments/711227582535696466/711230173642489966/FJDKkvViigy.gif",
					"https://cdn.weeb.sh/images/B14JM8Qw-.gif",
					"https://cdn.discordapp.com/attachments/711227582535696466/711230231083483156/RzFCvUCaFTa.gif",
					"https://cdn.weeb.sh/images/S1uZMIXP-.gif"
    
    
                
                  ]
                  
                  var blushrand = blushcol[Math.floor(Math.random() * blushcol.length)];
    
                const blushem = new Discord.MessageEmbed()
                .setTitle(`Awwe ${message.author.username} is blushing! Cutee!~`)
                .setImage(blushrand)
                .setColor("b39eb5")
    
                message.channel.send(blushem);
                break;
				
				}
				
				var blushcol = [
                    "https://media1.tenor.com/images/cbfd2a06c6d350e19a0c173dec8dccde/tenor.gif?itemid=15727535",
					"https://cdn.discordapp.com/attachments/711227582535696466/711230142831132753/95soD6bNkww.gif",
					"https://cdn.weeb.sh/images/SJkffIXw-.gif",
					"https://cdn.weeb.sh/images/r19GfI7vW.gif",
					"https://cdn.discordapp.com/attachments/711227582535696466/711230173642489966/FJDKkvViigy.gif",
					"https://cdn.weeb.sh/images/B14JM8Qw-.gif",
					"https://cdn.discordapp.com/attachments/711227582535696466/711230231083483156/RzFCvUCaFTa.gif",
					"https://cdn.weeb.sh/images/S1uZMIXP-.gif"
    
    
                
                  ]
                  
                  var blushrand = blushcol[Math.floor(Math.random() * blushcol.length)];
    
                const blushem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} is blushing over ${message.mentions.users.first().username}! How cute <3`)
                .setImage(blushrand)
                .setColor("b39eb5")
    
                message.channel.send(blushem);
                break;
			case 'eat':
                if(!args[1]){
                  var eatcol = [
                    "https://media1.tenor.com/images/aa94097e87f4386322b9609da96676d6/tenor.gif?itemid=8294804",
					"https://media1.tenor.com/images/4164627ef1e4c30aa68853f470587bdb/tenor.gif?itemid=9920838",
					"https://media1.tenor.com/images/193d1b9d83656fdc328138238e11d0cd/tenor.gif?itemid=13451320",
					"https://media1.tenor.com/images/960151a0c15fefd51e008e45e59486f9/tenor.gif?itemid=14108963",
					"https://media1.tenor.com/images/20e73db63d718c248ff915a164b91b45/tenor.gif?itemid=15402351",
					"https://media1.tenor.com/images/8a532ce9af5601928f860034d6129b43/tenor.gif?itemid=9266221"
    
    
                
                  ]
                  
                  var eatrand = eatcol[Math.floor(Math.random() * eatcol.length)];
    
                const eatem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} is enjoying a snack!`)
                .setImage(eatrand)
                .setColor("b39eb5")
    
                message.channel.send(eatem);
                break;	
				
				}
				
				var eatcol = [
                    "https://media1.tenor.com/images/aa94097e87f4386322b9609da96676d6/tenor.gif?itemid=8294804",
					"https://media1.tenor.com/images/4164627ef1e4c30aa68853f470587bdb/tenor.gif?itemid=9920838",
					"https://media1.tenor.com/images/193d1b9d83656fdc328138238e11d0cd/tenor.gif?itemid=13451320",
					"https://media1.tenor.com/images/960151a0c15fefd51e008e45e59486f9/tenor.gif?itemid=14108963",
					"https://media1.tenor.com/images/20e73db63d718c248ff915a164b91b45/tenor.gif?itemid=15402351",
					"https://media1.tenor.com/images/8a532ce9af5601928f860034d6129b43/tenor.gif?itemid=9266221"
    
    
                
                  ]
                  
                  var eatrand = eatcol[Math.floor(Math.random() * eatcol.length)];
    
                const eatem = new Discord.MessageEmbed()
                .setTitle(`${message.mentions.users.first().username} is being fed by ${message.author.username}! Adorable!~`)
                .setImage(eatrand)
                .setColor("b39eb5")
    
                message.channel.send(eatem);
                break;	
				
			case 'cry':
                if(!args[1]){
                  var crycol = [
                    "https://cdn.weeb.sh/images/ByPGQIQwb.gif",
					"https://cdn.discordapp.com/attachments/713914461362192394/713929950448582718/9iMWX_vM75R.gif",
					"https://cdn.discordapp.com/attachments/713914461362192394/713930019772039198/t4i74GvRfnJ.gif",
					"https://cdn.discordapp.com/attachments/713914461362192394/713929953044988246/COL-x4Z2gtu.gif",
					"https://media1.tenor.com/images/09b085a6b0b33a9a9c8529a3d2ee1914/tenor.gif?itemid=5648908",
					"https://media1.tenor.com/images/2fb2965acbf3ed573e8b63080b947fe5/tenor.gif?itemid=5091716",
					"https://media1.tenor.com/images/73afb40f4becbab10aee349b75a6b4ab/tenor.gif?itemid=12069252",
					"https://media1.tenor.com/images/98466bf4ae57b70548f19863ca7ea2b4/tenor.gif?itemid=14682297",
					"https://media1.tenor.com/images/b0f4b5f158e8a964adbabd048fb9e556/tenor.gif?itemid=13949015"
    
    
                
                  ]
                  
                  var cryrand = crycol[Math.floor(Math.random() * crycol.length)];
    
                const cryem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} is crying..`)
                .setImage(cryrand)
                .setColor("b39eb5")
    
                message.channel.send(cryem);
                break;
				
				}
				
				var crycol = [
                    "https://cdn.weeb.sh/images/ByPGQIQwb.gif",
					"https://cdn.discordapp.com/attachments/713914461362192394/713929950448582718/9iMWX_vM75R.gif",
					"https://cdn.discordapp.com/attachments/713914461362192394/713930019772039198/t4i74GvRfnJ.gif",
					"https://cdn.discordapp.com/attachments/713914461362192394/713929953044988246/COL-x4Z2gtu.gif",
					"https://media1.tenor.com/images/09b085a6b0b33a9a9c8529a3d2ee1914/tenor.gif?itemid=5648908",
					"https://media1.tenor.com/images/2fb2965acbf3ed573e8b63080b947fe5/tenor.gif?itemid=5091716",
					"https://media1.tenor.com/images/73afb40f4becbab10aee349b75a6b4ab/tenor.gif?itemid=12069252",
					"https://media1.tenor.com/images/98466bf4ae57b70548f19863ca7ea2b4/tenor.gif?itemid=14682297",
					"https://media1.tenor.com/images/b0f4b5f158e8a964adbabd048fb9e556/tenor.gif?itemid=13949015"
    
    
                
                  ]
                  
                  var cryrand = crycol[Math.floor(Math.random() * crycol.length)];
    
                const cryem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} is crying because of ${message.mentions.users.first().username}.. poor thing..`)
                .setImage(cryrand)
                .setColor("b39eb5")
    
                message.channel.send(cryem);
                break;
			case 'paimon':
                if(!args[1]){
                  var paicol = [
                    "https://media1.tenor.com/images/3a5a93f305a1de6395c933539534bb70/tenor.gif?itemid=18640817",
					"https://media1.tenor.com/images/6e3c3043fda5b0085da74405819aca49/tenor.gif?itemid=18741726",
					"https://media1.tenor.com/images/a75c55bfe2b651b0ca2f381f625a5d9a/tenor.gif?itemid=18714751",
					"https://media1.tenor.com/images/153a2202d3254d336501f5a85407b352/tenor.gif?itemid=18690957",
					"https://media1.tenor.com/images/e64d50ec04c03220b93da4d322e9c8ae/tenor.gif?itemid=18690587",
					"https://media1.tenor.com/images/83c51c0e7a340e6b3d30de2e9e2a1393/tenor.gif?itemid=18658050"
    
    
                
                  ]
                  
                  var pairand = paicol[Math.floor(Math.random() * paicol.length)];
    
                const paiem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username}, here's your daily dose of Paimon!~`)
                .setImage(pairand)
                .setColor("b39eb5")
    
                message.channel.send(paiem);
                break;
				
				}
				
				var paicol = [
                    "https://media1.tenor.com/images/3a5a93f305a1de6395c933539534bb70/tenor.gif?itemid=18640817",
					"https://media1.tenor.com/images/6e3c3043fda5b0085da74405819aca49/tenor.gif?itemid=18741726",
					"https://media1.tenor.com/images/a75c55bfe2b651b0ca2f381f625a5d9a/tenor.gif?itemid=18714751",
					"https://media1.tenor.com/images/153a2202d3254d336501f5a85407b352/tenor.gif?itemid=18690957",
					"https://media1.tenor.com/images/e64d50ec04c03220b93da4d322e9c8ae/tenor.gif?itemid=18690587",
					"https://media1.tenor.com/images/83c51c0e7a340e6b3d30de2e9e2a1393/tenor.gif?itemid=18658050"
    
    
                
                  ]
                  
                  var pairand = paicol[Math.floor(Math.random() * paicol.length)];
    
                const paiem = new Discord.MessageEmbed()
                .setTitle(`Looks like ${message.mentions.users.first().username} is in luck! They're being offered some Paimon by ${message.author.username}`)
                .setImage(pairand)
                .setColor("b39eb5")
    
                message.channel.send(paiem);
                break;
			case 'die':
                if(!args[1]){
                  var diecol = [
                    "https://media1.tenor.com/images/3c1b3bec9dc5834b99767bc2c886bd51/tenor.gif?itemid=16032459",
					"https://media1.tenor.com/images/25a5b0faa2044db0b1e5e3ab2fb8d4f0/tenor.gif?itemid=15157935",
					"https://media1.tenor.com/images/78c31cb0266d4141256a33ed3368e44d/tenor.gif?itemid=15759497",
					"https://media1.tenor.com/images/bf1e5ee94ccd13576d3520d60d692317/tenor.gif?itemid=5384592",
					"https://media1.tenor.com/images/892c19f08fb080b3ad794e713fd65dbb/tenor.gif?itemid=15404688",
					"https://media1.tenor.com/images/003b4a82e708a3e324aba7d5bcaae8f3/tenor.gif?itemid=15759433",
					"https://media1.tenor.com/images/bfe6a2f89ec3f035a546c6e07ca3bec5/tenor.gif?itemid=13098659",
					"https://media1.tenor.com/images/8cbe51c3cf9e85db0d5acb4e317a746c/tenor.gif?itemid=17056408"
    
    
                
                  ]
                  
                  var dierand = diecol[Math.floor(Math.random() * diecol.length)];
    
                const dieem = new Discord.MessageEmbed()
                .setTitle(`Oh no! ${message.author.username} died! Poor soul..`)
                .setImage(dierand)
                .setColor("b39eb5")
    
                message.channel.send(dieem);
                break;
				
				}
				
				var diecol = [
                    "https://media1.tenor.com/images/3c1b3bec9dc5834b99767bc2c886bd51/tenor.gif?itemid=16032459",
					"https://media1.tenor.com/images/25a5b0faa2044db0b1e5e3ab2fb8d4f0/tenor.gif?itemid=15157935",
					"https://media1.tenor.com/images/78c31cb0266d4141256a33ed3368e44d/tenor.gif?itemid=15759497",
					"https://media1.tenor.com/images/bf1e5ee94ccd13576d3520d60d692317/tenor.gif?itemid=5384592",
					"https://media1.tenor.com/images/892c19f08fb080b3ad794e713fd65dbb/tenor.gif?itemid=15404688",
					"https://media1.tenor.com/images/003b4a82e708a3e324aba7d5bcaae8f3/tenor.gif?itemid=15759433",
					"https://media1.tenor.com/images/bfe6a2f89ec3f035a546c6e07ca3bec5/tenor.gif?itemid=13098659",
					"https://media1.tenor.com/images/8cbe51c3cf9e85db0d5acb4e317a746c/tenor.gif?itemid=17056408"
    
    
                
                  ]
                  
                  var dierand = diecol[Math.floor(Math.random() * diecol.length)];
    
                const dieem = new Discord.MessageEmbed()
                .setTitle(`What?! ${message.author.username} is trying to attack ${message.mentions.users.first().username}!`)
                .setImage(dierand)
                .setColor("b39eb5")
    
                message.channel.send(dieem);
                break;	
                case 'sniff':
                  if(!args[1]){
                    var sniffcol = [
                      "https://media1.tenor.com/images/2e0bd42659108e56c455ec0e6841acbe/tenor.gif?itemid=4921285",
                      "https://media1.tenor.com/images/90ff2220b20b1fe5f5d39027af1f7063/tenor.gif?itemid=17233662",
                      "https://media1.tenor.com/images/d640d170240e98cd8ebc56ba15882cde/tenor.gif?itemid=16073069",
                      "https://media1.tenor.com/images/61c80c1a31ade94c465f15c8ee9ece88/tenor.gif?itemid=8944181",
                      "https://cdn.discordapp.com/attachments/756968214554083328/776890609544724500/sniff.gif",
                      "https://cdn.discordapp.com/attachments/756968214554083328/776891029050753104/Cherry_sniffs_under_Miyuki27s_skirt.gif"
      
      
                  
                    ]
                    
                    var sniffrand = sniffcol[Math.floor(Math.random() * sniffcol.length)];
      
                  const sniffem = new Discord.MessageEmbed()
                  .setTitle(`${message.author.username} is sniffing around..`)
                  .setImage(sniffrand)
                  .setColor("b39eb5")
      
                  message.channel.send(sniffem);
                  break;
          
          }
          
          var sniffcol = [
            "https://media1.tenor.com/images/2e0bd42659108e56c455ec0e6841acbe/tenor.gif?itemid=4921285",
            "https://media1.tenor.com/images/90ff2220b20b1fe5f5d39027af1f7063/tenor.gif?itemid=17233662",
            "https://media1.tenor.com/images/d640d170240e98cd8ebc56ba15882cde/tenor.gif?itemid=16073069",
            "https://media1.tenor.com/images/61c80c1a31ade94c465f15c8ee9ece88/tenor.gif?itemid=8944181",
            "https://cdn.discordapp.com/attachments/756968214554083328/776890609544724500/sniff.gif",
            "https://cdn.discordapp.com/attachments/756968214554083328/776891029050753104/Cherry_sniffs_under_Miyuki27s_skirt.gif"


        
          ]
          
          var sniffrand = sniffcol[Math.floor(Math.random() * sniffcol.length)];

        const sniffem = new Discord.MessageEmbed()
        .setTitle(`Huh?! ${message.author.username} is sniffing ${message.mentions.users.first().username}.. strange..`)
        .setImage(sniffrand)
        .setColor("b39eb5")

        message.channel.send(sniffem);
        break;
            case 'cuddle':
                if(!args[1]) return message.channel.send("Mention a user to cuddle!");
                var cudcol = [
                    "https://media.tenor.com/images/2137dc0577128507833cfadc97a351c1/tenor.gif",
                    "https://media1.tenor.com/images/d16a9affe8915e6413b0c1f1d380b2ee/tenor.gif?itemid=12669052",
                    "https://i.pinimg.com/originals/f2/80/5f/f2805f274471676c96aff2bc9fbedd70.gif",
                    "https://media1.tenor.com/images/6f7eebef17bf270fd7e1cb9117d190be/tenor.gif?itemid=16542536",
                    "https://media1.tenor.com/images/bfacd94f66bdde64009f420277464e67/tenor.gif?itemid=15069983",
                    "https://media1.tenor.com/images/7edded2757934756fdc240019d956cb3/tenor.gif?itemid=16403937",
                    "https://media1.tenor.com/images/9af57b60dca6860724a0ff6c1689c246/tenor.gif?itemid=8467962",
                    "https://media1.tenor.com/images/c445e2665d12cfda0921291d919cbe9a/tenor.gif?itemid=15069987",
                    "https://media1.tenor.com/images/d0c2e7382742f1faf8fcb44db268615f/tenor.gif?itemid=5853736",
                    "https://media1.tenor.com/images/adeb030aaa5a2a3d16abdc58be4d1448/tenor.gif?itemid=11733535",
                    "https://media1.tenor.com/images/012cc6d6cb65c3c98bd5505ab2e1c42a/tenor.gif?itemid=13317505",
                    "https://media1.tenor.com/images/8f8ba3baeecdf28f3e0fa7d4ce1a8586/tenor.gif?itemid=12668750"
    
    
                
                  ]
                  
                  var cudrand = cudcol[Math.floor(Math.random() * cudcol.length)];
    
                const cudem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} cuddled ${message.mentions.users.first().username}`)
                .setImage(cudrand)
                .setColor("b39eb5")
    
                message.channel.send(cudem);
                break;
				
				case 'stab':
                if(!args[1]){

                  var stabcol = [
                    
                    "https://45.media.tumblr.com/0c1c2c190dc6cef664fa567e3b6cfa55/tumblr_nhufcsd5uU1rzpynio1_500.gif"
                    
    
                
                  ]
                  
                  var stabrand = stabcol[Math.floor(Math.random() * stabcol.length)];
    
                const stabem = new Discord.MessageEmbed()
                .setTitle(`Ooppssiee, did ${message.author.username} just accidentally stab themself? RIP. \n\n *****>>>Mention an user to stab<<<*****`)
                .setImage(stabrand)
    
                message.channel.send(stabem);
                break;

                }

                var stabcol = [
                    "https://media1.tenor.com/images/5235dda6107b8369045d1699448ad854/tenor.gif?itemid=4872707",
                    "https://i.kym-cdn.com/photos/images/original/000/934/866/c5b.gif",
                    "https://i.kym-cdn.com/photos/images/newsfeed/001/259/832/43a.gif",
                    "https://steamuserimages-a.akamaihd.net/ugc/36367778822824173/88018B6CC9B5EA082A1CDCBD5D6DF7B6406C6865/",
                    "https://forum.level1techs.com/uploads/default/original/3X/f/0/f01a927feab698f793b01420d399ee991d4e8591.gif",
                    "https://media1.tenor.com/images/d42b8c67ceb776052cadb53306dd2b12/tenor.gif?itemid=16751402",
                    "https://media0.giphy.com/media/VL87txURjAknK/giphy.gif",
                    "https://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif-3.gif",
                    "https://i.pinimg.com/originals/69/95/f6/6995f6a0dd021ae706b4726b1537a83e.gif"
                    

                    
    
                
                  ]
                  
                  var stabrand = stabcol[Math.floor(Math.random() * stabcol.length)];
    
                const stabem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} stabbed ${message.mentions.users.first().username}! Rest in peace~~`)
                .setImage(stabrand)
    
                message.channel.send(stabem);
                break;
				
			case 'slap':

      try{
				if(!args[1]) return message.channel.send("Mention a user to slap!");

              var slapcol = [
                  "https://i.pinimg.com/originals/6d/4c/be/6d4cbe4a871d8bd4a89eb60169e450cd.gif",
                  "https://thumbs.gfycat.com/IllinformedRigidAfricangoldencat-size_restricted.gif",
                  "https://media1.tenor.com/images/e0c9f31dbc1b024800b1e09e38d74fb0/tenor.gif?itemid=16996591",
                  "https://media1.tenor.com/images/74db8b0b64e8d539aebebfbb2094ae84/tenor.gif?itemid=15144612",
                  "https://media1.tenor.com/images/9ea4fb41d066737c0e3f2d626c13f230/tenor.gif?itemid=7355956",
                  "https://media1.tenor.com/images/416ce127ae441cff2825ce2b992df736/tenor.gif?itemid=17342897",
                  "https://media1.tenor.com/images/f0aa023d6422ad071f91e7a825a072fa/tenor.gif?itemid=14844123",
                  "https://media1.tenor.com/images/53f7a45f41b45f46c9a6c4dc154e58c5/tenor.gif?itemid=16268549",
                  "https://i.pinimg.com/originals/46/b0/a2/46b0a213e3ea1a9c6fcc060af6843a0e.gif"
  
  
              
                ]
                
                var slaprand = slapcol[Math.floor(Math.random() * slapcol.length)];
  
              const slapem = new Discord.MessageEmbed()
              .setTitle(`${message.author.username} slapped ${message.mentions.users.first().username}! Ouchiesss..`)
              .setImage(slaprand)
  
              message.channel.send(slapem);
              
      }catch(err){
        console.log("Slap command error");
      }
      break;
      case 'bonk':

        try{
          if(!args[1]) return message.channel.send("Mention a user to bonk!");
  
                var bonkcol = [
                    "https://media1.tenor.com/images/cf9f90ce4ccca4fe6d82bb445ca4759e/tenor.gif?itemid=8229175",
                    "https://media1.tenor.com/images/dc4329d27745a6707219cb658f5b2c46/tenor.gif?itemid=18191826",
                    "https://media1.tenor.com/images/3fd96f4dcba48de453f2ab3acd657b53/tenor.gif?itemid=14358509",
                    "https://media1.tenor.com/images/4a6b15b8d111255c77da57c735c79b44/tenor.gif?itemid=10937039",
                    "https://media1.tenor.com/images/98d58d3338ad63b8304aa3a02ce5e99a/tenor.gif?itemid=13911344"
    
    
                
                  ]
                  
                  var bonkrand = bonkcol[Math.floor(Math.random() * bonkcol.length)];
    
                const bonkem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} bonked ${message.mentions.users.first().username}! Ouchiesss..`)
                .setImage(bonkrand)
    
                message.channel.send(bonkem);
                
        }catch(err){
          console.log("Bonk command error");
        }
        break;

      case 'scream':
       
          var screamcol = [
            "https://media.tenor.com/images/5d95d35aa4321d9d143ce83d3de81741/tenor.gif",
            "https://i.gifer.com/SZDF.gif",
            "https://media1.giphy.com/media/7J4pbfnQaamDjzGAnq/200.gif",
            "https://i.kym-cdn.com/photos/images/newsfeed/001/087/494/18d.gif",
            "https://78.media.tumblr.com/3a4fa1a09dde5349e324a2b4271d13e3/tumblr_pcbrtsttwC1xrqgt2o1_640.gif",
            "https://i.gifer.com/SZDC.gif",
            "https://media.tenor.com/images/b07017c1bec2c5ef9e243d20427125c4/tenor.gif",
            "https://media1.tenor.com/images/668fda7d171ce5022fd0a1f3a6e0a780/tenor.gif?itemid=7355048",
            "https://media1.tenor.com/images/35b008120ba7e4e424931c86ffce986f/tenor.gif?itemid=5633060"
            
        
          ]
          
        var screamrand = screamcol[Math.floor(Math.random() * screamcol.length)];

        const screamem = new Discord.MessageEmbed()
        .setTitle(`${message.author.username} is screaming @#$@&$*%&#`)
        .setImage(screamrand)
        .setColor("b39eb5")

        message.channel.send(screamem);

        break;

            case 'cookie':
              if(!args[1]) return message.channel.send("You can't just throw a blap certified cookie in thin air! Mention a user.");

              message.channel.send(`${message.mentions.users.first()}, You just received a blap certified cookie from ${message.author} :cookie: YUuuMM!`);

            break;

            

            case 'known':
              const knownem = new Discord.MessageEmbed()
              .setTitle("Known Members")
              .setDescription("This role is given to those who show a considerable amount of activity on the server to be recognized by the community. With this role you gain access to privileges such as: \n\n ╔═══════════════╗ \n -Posting media in the general chats \n -Access to the colors in <#769048935045922856> \n -Access to the `/revive` command \n -Eligibility to apply for staff \n ╚═══════════════╝ \n\n This role is achieved by reaching **level 3** on the Piggy bot. You may check your level using the ``^info`` command in the <#769043828065304586> channel.")
              .setColor("#D3D3D3")

              message.channel.send(knownem);
              break;

            case 'leaderboard':
                message.channel.send("https://piggy.gg/leaderboard/748334198443737150")
                break;
			
			
			///////                ///////
            ///////                ///////
            ///////       Pings    ///////
            ///////                ///////
            ///////                ///////
			
			case 'partnerping':
			if (partnerRecently.has(message.author.id))
			return message.channel.send(`The partner ping command is currently on cooldown!`);
			partnerRecently.add(message.author.id);
setTimeout(() => {
			partnerRecently.delete(message.author.id);
}, 300000);
			if(!message.member.roles.cache.has('772862183653900299')) 	
			    return message.channel.send(`This command is exclusively for partnership managers.`);
                message.channel.send(`<@&769256879892463676>`)
                break;
			
			case 'textevent':
			if (pingedRecently.has(message.author.id))
			return message.channel.send(`The text event ping command is currently on cooldown!`);
			pingedRecently.add(message.author.id);
setTimeout(() => {
			pingedRecently.delete(message.author.id);
}, 600000);
			if(!message.member.roles.cache.has('772870155922833438')) 	
			    return message.channel.send(`This command is exclusively for event staff.`);
                message.channel.send(`<@&769256834757951571> <@&769259461717000243>`)
                break;
			
			case 'vcevent':
			if (pingedRecently.has(message.author.id))
			return message.channel.send(`The voice event ping command is currently on cooldown!`);
			pingedRecently.add(message.author.id);
setTimeout(() => {
			pingedRecently.delete(message.author.id);
}, 600000);
			if(!message.member.roles.cache.has('772870155922833438')) 	
			    return message.channel.send(`This command is exclusively for event staff.`);
                message.channel.send(`<@&769256834757951571> <@&769259365713838131>`)
                break;
			
			case 'gamingevent':
			if (pingedRecently.has(message.author.id))
			return message.channel.send(`The gaming event ping command is currently on cooldown!`);
			pingedRecently.add(message.author.id);
setTimeout(() => {
			pingedRecently.delete(message.author.id);
}, 600000);
			if(!message.member.roles.cache.has('772870155922833438')) 	
			    return message.channel.send(`This command is exclusively for event staff.`);
                message.channel.send(`<@&769256834757951571> <@&769259420253028424>`)
                break;
			
			case 'nightevent':
			if (pingedRecently.has(message.author.id))
			return message.channel.send(`The movie night event ping command is currently on cooldown!`);
			pingedRecently.add(message.author.id);
setTimeout(() => {
			pingedRecently.delete(message.author.id);
}, 600000);
			if(!message.member.roles.cache.has('772870155922833438')) 	
			    return message.channel.send(`This command is exclusively for event staff.`);
                message.channel.send(`<@&769256834757951571> <@&769259335489814548>`)
                break;

          

          case 'timer':
                

                if(!message.member.roles.cache.has('769094800904552489'))
				if(!message.member.roles.cache.has('769050044069707787'))
					return message.channel.send(`This command is exclusively for staff members, ${message.author}.`);
                if(!args[1]) return;

                var time = args[1];
                var timeWork = args[1] * 60000;
                let reason = args.splice(2).join(" ");

                if(time === '1'){
                  message.channel.send(`Timer set for ${time} minute. `);
                setTimeout(() => {
                  message.channel.send(`${time} minute is over, ${message.author}!\n\n**Timer reason:** ${reason}`);
              }, timeWork);
                }else{

                message.channel.send(`Timer set for ${time} minutes. `);
                setTimeout(() => {
                  message.channel.send(`${time} minutes is over, ${message.author}!\n\n**Timer reason:** ${reason}`);
              }, timeWork);
            }
              break;


            case 'dm':

                if(!message.member.roles.cache.has('773967348800421888')) return message.channel.send(`This command is exclusively for known members.`);
                if(!args[1]) return message.channel.send("Uh, you didn't include any message to send.");
                let dmSay = args.splice(2).join(" ")

                
                const dmem = new Discord.MessageEmbed()
                .setTitle(`${message.author.username} messaged: `)
                .setDescription(dmSay)
                .setTimestamp()
                try{
                message.mentions.users.first().send(dmem)
                }catch(err){
                  message.author.send("Error");
                }
                
                  

    

                bot.on('error', console.error);



                message.channel.send("DM sent!");


            break;

            case 'anondm':
                //Message from Sunny's Cornerstone

                if(!message.member.roles.cache.has('769049952272777216'))
				if(!message.member.roles.cache.has('769049963849056277'))
					return message.channel.send(`You do not have the permission to use this command, ${message.author}.`)

                if(!args[1]) return message.channel.send("Uh, you didn't include any message to send.");
                let dmAnonSay = args.splice(2).join(" ")

                var err = 0;
                const dmanonem = new Discord.MessageEmbed()
                .setTitle("Message from Retrocade: ")
                .setDescription(dmAnonSay)
                .setTimestamp()
                try{
                message.mentions.users.first().send(dmanonem)
                }
                catch(err){
                  message.channel.send("Error!")
                  return;

                }
                
                message.channel.send("DM sent!");



                  
                
                
            break;
            case 'acceptevent':
              //Message from Sunny's Cornerstone
              if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have the permission to use this command.");
              
              

              

              if(!args[1]) return message.channel.send("Please ping the user you'd like to accept");

              var err = 0;
              const acceptevem = new Discord.MessageEmbed()
              .setTitle("Message from Retrocade: ")
              .setDescription("╔══.·:·.✧    ✦    ✧.·:·.══╗\nUpon reviewing your application for the **Event Staff** position, your application has been..\n\n𝔸𝕔𝕔𝕖𝕡𝕥𝕖𝕕!\n\nWelcome to the Retrocade event staff team! You'll want to start by looking into the new Staff Category you'll find on the server. The most notable ones available to your position will be the <#769277949178281984> as well as the <#770050413704642600> page where you will be informed on your new privileges.\n\nThank you so much for wanting to be a part of the event staff team, I hope we can have an amazing time working together to create a fun and lively environment for our members :heart:\n╚══.·:·.✧    ✦    ✧.·:·.══╝")
              .setColor("#aec6cf")
              .setTimestamp()
              const acceptedeventstaff = message.mentions.members.first();
              try{
              acceptedeventstaff.send(acceptevem);
              }
              catch(err){
                console.log(err)
                message.channel.send("Error!")
                return;

              }
              var eventrole = message.guild.roles.cache.get("772870155922833438");
              const guildeventmember = message.mentions.members.first();
              try{
                guildeventmember.roles.add(eventrole);
              }
              catch(err){
                console.log(err);
                message.channel.send("Error!")
                return;
              }
              

              message.channel.send(`${message.mentions.users.first().username} has been accepted!`);

          
              
          break;

        
          
          case 'acceptpartner':
              //Message from Sunny's Cornerstone
              if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have the permission to use this command.");


              if(!args[1]) return message.channel.send("Please ping the user you'd like to accept");

              var err = 0;
              const acceptpaem = new Discord.MessageEmbed()
              .setTitle("Message from Retrocade: ")
              .setDescription("╔══.·:·.✧    ✦    ✧.·:·.══╗\nUpon reviewing your application for the **Partnership Manager** position, your application has been..\n\n𝔸𝕔𝕔𝕖𝕡𝕥𝕖𝕕!\n\nWelcome to the Retrocade Partnership Staff team! You'll want to start by looking into the new Staff Category you'll find on the server. The most notable ones available to your position will be the <#769277949178281984> as well as the <#770050413704642600> page where you will be informed on your new privileges.\n\nThank you so much for wanting to be a part of the Partnership Staff team, I hope we can have an amazing time working together towards creating a larger member base along with new servers to cooperate with :heart:\n╚══.·:·.✧    ✦    ✧.·:·.══╝")
              .setColor("#aec6cf")
              .setTimestamp()
              const acceptedpartnerstaff = message.mentions.members.first();
              try{
              acceptedpartnerstaff.send(acceptpaem);
              }
              catch(err){
                console.log(err)
                message.channel.send("Error!")
                return;

              }
              var partnerrole = message.guild.roles.cache.get("772862183653900299");
              const guildpartnermember = message.mentions.members.first();
              try{
                guildpartnermember.roles.add(partnerrole);
              }
              catch(err){
                console.log(err);
                message.channel.send("Error!")
                return;
              }
              

              message.channel.send(`${message.mentions.users.first().username} has been accepted!`);

          
              
          break;
          case 'acceptchat':
              //Message from Sunny's Cornerstone
              if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have the permission to use this command.");

              if(!args[1]) return message.channel.send("Please ping the user you'd like to accept");

              var err = 0;
              const acceptchaem = new Discord.MessageEmbed()
              .setTitle("Message from Retrocade: ")
              .setDescription("╔══.·:·.✧ ✦ ✧.·:·.══╗\nUpon reviewing your application and having a vote held by staff, your application has been..\n\n𝔸𝕔𝕔𝕖𝕡𝕥𝕖𝕕!\n\nWelcome to the Retrocade staff team! You'll want to start by looking into the new Staff Category you'll find on the server. Firstly, head over to the <#770050480415178762> channel. Once you agree to these regulations by text you'll shortly be given your staff role. After receiving, you may explore the staff category. You may head over to <#770050413704642600> to see your permissions.\n\nThank you so much for wanting to be a part of the staff team, I hope we can have an amazing time working together to keep this a safe, enjoyable place :heart:\n╚══.·:·.✧ ✦ ✧.·:·.══╝")
              .setColor("#aec6cf")
              .setTimestamp()
              const acceptedchatstaff = message.mentions.members.first();
              try{
              acceptedchatstaff.send(acceptchaem);
              }
              catch(err){
                console.log(err)
                message.channel.send("Error!")
                return;

              }
              var chatrole = message.guild.roles.cache.get("770150825552904212");
              const guildchatmember = message.mentions.members.first();
              try{
                guildchatmember.roles.add(chatrole);
              }
              catch(err){
                console.log(err);
                message.channel.send("Error!")
                return;
              }
              

              message.channel.send(`${message.mentions.users.first().username} has been accepted!`);

          
              
          break;

          case 'kick':
          if(message.author.bot) return;
          if(message.member.hasPermission("KICK_MEMBERS")){
          const Kicker = message.member;
          if(!args[1]) return message.channel.send("You didn't specify the user to kick.");
          if(!args[2]) return message.channel.send("You're required to provide a reason for the kick.");
          let reason = args.splice(2).join(" ")
          

          const kickMember = message.mentions.members.first();
          if(kickMember === Kicker) return message.channel.send("You cannot kick yourself.");
          if(kickMember.roles.highest.position === Kicker.roles.highest.position) return message.channel.send("You cannot kick someone with the same position as you.");
          if(kickMember.roles.highest.position > Kicker.roles.highest.position) return message.channel.send('You cannot kick someone higher than you.');
          kickMember.send(`You've been kicked from **Retrocade**\nReason: ${reason}`);

          const modlog = bot.channels.cache.get("769266241411874897");

          const modkicklogem = new Discord.MessageEmbed()
          .setTitle("User has been kicked from the server")
          .setThumbnail(message.mentions.users.first().avatarURL())
          .addFields(
            {name: `User kicked`, value: `${kickMember} (${kickMember.id})`},
            {name: `Responsible staff member`, value: `${message.author}`},
            {name: "Reason", value: `${reason}`}
          )
          .setTimestamp()

          modlog.send(modkicklogem);

          kickMember.kick().then(() => {
          message.channel.send(`${message.mentions.users.first().tag} has been kicked.`);
          });
      }else{
        message.channel.send("You don't have permission to use this command.");
      }
      break;
      case 'ban':
        if(message.author.bot) return;
        if(message.member.hasPermission("BAN_MEMBERS")){
          const Banner = message.member;
          if(!args[1]) return message.channel.send("You didn't specify the user to ban.");
          if(!args[2]) return message.channel.send("You're required to provide a reason for the ban.");
          let reason = args.splice(2).join(" ")

          const banMember = message.mentions.members.first();
          if(banMember === Banner) return message.channel.send("You cannot ban yourself.");
          if(banMember.roles.highest.position === Banner.roles.highest.position) return message.channel.send("You cannot ban someone with the same position as you.");
          if(banMember.roles.highest.position > Banner.roles.highest.position) return message.channel.send('You cannot ban someone higher than you.');
          banMember.send(`You've been banned from **Retrocade**\nReason: ${reason}`);

          const modlog = bot.channels.cache.get("769266241411874897");

          const modbanlogem = new Discord.MessageEmbed()
          .setTitle("User has been banned from the server")
          .setThumbnail(message.mentions.users.first().avatarURL())
          .addFields(
            {name: `User banned`, value: `${banMember} (${banMember.id})`},
            {name: `Responsible staff member`, value: `${message.author}`},
            {name: "Reason", value: `${reason}`}
          )
          .setTimestamp()

          modlog.send(modbanlogem);

          banMember.ban().then(() => {
          message.channel.send(`${message.mentions.users.first().tag} has been banned.`);
          });
      }else{
        message.channel.send("You don't have permission to use this command.");
      }
    break;

             ///////                ////////
            ///////                ///////
            /////// MODERATION     ///////
            ///////                ///////
            ///////                ///////

            case 'cl':
          if(!message.member.roles.cache.has('769094800904552489')) return message.channel.send(`You do not have the permission to use this command, ${message.author}.`)
          if(!args[1]) return message.channel.send("You haven't included the number of messages to clear.")
          if(isNaN(args[1])) return message.channel.send(`${args[1]} is not a number?`)
          message.channel.bulkDelete(args[1]);
            break;
            case 'avatar':
              if(message.author.bot) return;
              if(!args[1]){
                selfpfp = new Discord.MessageEmbed()
                .setDescription(`${message.author}'s avatar`)
                .setImage(message.author.avatarURL())

                message.channel.send(selfpfp);
              }
              
              basicpfp = new Discord.MessageEmbed()
              .setDescription(`${message.mentions.users.first()}'s avatar`)
              .setImage(message.mentions.users.first().avatarURL())

              message.channel.send(basicpfp);
            break;
    }

	}catch(err){
		console.log(error);
  }
    });

    bot.on("message", async message => {
      let args = message.content.substring(prefix.length).split(" ");
      switch(args[0]){
        case 'unban':
        

        if(message.member.hasPermission("ADMINISTRATOR")){
          const unbanMember = await bot.users.fetch(args[1]).catch(console.log);
  
          const unbanlog = bot.channels.cache.get("769266241411874897");
  
          const unbanlogem = new Discord.MessageEmbed()
            .setTitle("User has been unbanned")
            .addFields(
              {name: `User unbanned`, value: `${unbanMember}`},
              {name: `Responsible staff member`, value: `${message.author}`},
              
            )
            .setTimestamp()
  
            unbanlog.send(unbanlogem);
  
          message.guild.members.unban(unbanMember, {reason: "unbanned"}).then(() => {
            message.channel.send(`${unbanMember.tag} has been unbanned.`);
          });
        }

        if(message.member.roles.cache.has("769049979770896414")){
          const unbanMember = await bot.users.fetch(args[1]).catch(console.log);
  
          const unbanlog = bot.channels.cache.get("769266241411874897");
  
          const unbanlogem = new Discord.MessageEmbed()
            .setTitle("User has been unbanned")
            .addFields(
              {name: `User unbanned`, value: `${unbanMember}`},
              {name: `Responsible staff member`, value: `${message.author}`},
              
            )
            .setTimestamp()
  
            unbanlog.send(unbanlogem);
  
          message.guild.members.unban(unbanMember, {reason: "unbanned"}).then(() => {
            message.channel.send(`${unbanMember.tag} has been unbanned.`);
          });
        }
        
        break;
        
      }
      
      
    });

    bot.on('guildMemberAdd', async (gMember) => {
      // If the User hasn't joined our server specifically, return.
      if (gMember.guild.id !== '769038290514083861') return;
      
      // Fetch the Guild cache since discord sometimes flushes inactive people.
      const guildMembers = await gMember.guild.members.fetch();
    
      // Generate the Welcome Embed.
      let image = new Welcome()
        .setUsername(gMember.user.username)
        .setDiscriminator(gMember.user.discriminator)
        .setMemberCount(gMember.guild.members.cache.size)
        .setGuildName(gMember.guild.name)
        .setAvatar(gMember.user.displayAvatarURL({format: 'jpeg'}))
        .setColor("border", "#8015EA")
        .setColor("username-box", "#8015EA")
        .setColor("discriminator-box", "#8015EA")
        .setColor("message-box", "#8015EA")
        .setColor("title", "#8015EA")
        .setColor("avatar", "#8015EA")
        .setBackground("https://i.redd.it/vda9rbt01en01.png");
      
        image.textMessage = 'Welcome to Retrocade!';
    
      // Turn it into an attachment.
      image = await image.toAttachment();
      const attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome.png");
    
      // Generate an Embed for the Attachment
    
      const embed = new Discord.MessageEmbed()
        .setDescription(`**Welcome to Retrocade! Make sure to go to <#867108134223740948> to introduce yourself and don't forget to get yourself a stylish color from <#867114024200962088>! We hope you enjoy your stay here!**`)
        .setColor('0x8015EA')
        .setTimestamp(gMember.joinedAt)
        .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL({format: 'png'}))
        .setFooter('Member joined the server')
        .attachFiles([attachment])
        .setImage('attachment://welcome.png')
        .addField('Account Age', `This user joined Discord <t:${Math.round(gMember.user.createdAt / 1000)}:R>`);
    
      // Take the channel and send the file in that channel.
      const sendChannel = gMember.guild.channels.cache.get('867108204453560360');
    
      // Send the Embed in the Channel
      await sendChannel.send(embed);
    })


    
    bot.on("message", message => {

      if(message.author.bot) return;
      if(message.content === "/ticket" && message.channel.id === "769473051619754004"){
        if(userTickets.has(message.author.id)){
          message.author.send("A ticket is already running!");
      }
      else
      {
      message.channel.send("Ticket started!")
    
      const staff = message.guild.roles.cache.get("769472693329854474");
      const everyone = message.guild.roles.cache.get("769038290514083861");
      
      message.guild.channels.create(`ticket (${message.author.username})`, {
        type: 'text',
        permissionOverwrites: [
          {
            allow: 'VIEW_CHANNEL',
            id: staff
          },
          {
            deny: 'VIEW_CHANNEL',
            id: everyone
          },
          {
            allow: 'VIEW_CHANNEL',
            id: message.author.id
          }
        ]
        }).then(ch => {
          userTickets.set(message.author.id, ch.id);
          ch.send(`<@&769472693329854474>`)
          ch.send(`Hey there, ${message.author}!\nWelcome to your private ticket channel. Please wait until you get a staff to pick up on your ticket and assist you!\n\nN.B: When your issue has been resolved, please type **/endticket** to end the ticket!`);
        }).catch(err => console.log(error));
    
      }
    }
      else if(message.content === "/endticket"){
        if(userTickets.has(message.author.id)){
          if(message.channel.id === userTickets.get(message.author.id)){
            message.channel.delete('close ticket')
            
            .then(channel => {
              userTickets.delete(message.author.id);
              if(message.content === "/erasetickets"){
                userTickets.delete(message.author.id);
              }
            })
          }
        }
    
      }
    
    
      
    
    
    });

    bot.on("messageDelete", message => {

      if(message.author.bot) return;
      if(message.guild.id != '769038290514083861') return;
      const deletelogChannel = bot.channels.cache.get("769268846988886106");
    
      const deletelog = new Discord.MessageEmbed()
      .setTitle("Message deleted")
      .setColor("EE3838")
      .setThumbnail(message.author.avatarURL())
      .addFields(
        {name: "User", value: `${message.author.tag} (${message.author.id})`},
        {name: "Channel", value: `${message.channel}`},
        {name: "Message", value: `${message.content}`}
      )
      .setTimestamp()
      deletelogChannel.send(deletelog);
  
    
    });
  
    bot.on("messageUpdate", async (oldMessage, newMessage) => {
      if(oldMessage.content === newMessage.content) return;
      if(message.author.bot) return;
      
      
      const editlogChannel = bot.channels.cache.get("769268846988886106");
  
      const editlog = new Discord.MessageEmbed()
      .setTitle("Message edited")
      .setColor("3B77D2")
      .setThumbnail(oldMessage.author.avatarURL())
      .addFields(
        {name: "User", value:`${oldMessage.author.tag} (${oldMessage.author.id})`},
        {name: "Channel", value: `${oldMessage.channel}`},
        {name: "Message edited from", value: `${oldMessage.content}`},
        {name: "To", value: `${newMessage.content}`}
      )
      .setTimestamp()
  
        editlogChannel.send(editlog);
    });

    bot.on("message", message => {
      var agreementarray = ['agree'];
    
      if(message.channel.id === "770050480415178762"){
    
      if(agreementarray.some(word => ` ${message.content.toLowerCase()}`.includes(` ${word}`))){
        message.react("✅");
        message.member.roles.remove("770150825552904212");
        message.member.roles.add("769050044069707787");
        message.member.send("Welcome! You've been fully accepted into the staff team!");
      }
    }else{
      return;
    }
    });

    bot.on("message", message => {
      if (message.content === '!reset') {
        if (message.author.id !== '331401818619772928') return;
        message.channel.send('Restarted.').then(() => {
        process.exit(1);
      })
    };
    })

    bot.on("message", message => {
      if (message.content === '!reset') {
        if (message.author.id !== '237793557992308736') return;
        message.channel.send('Restarted.').then(() => {
        process.exit(1);
      })
    };
    });

    



bot.login(token);


const app = require('express')();

app.listen(3000, () => console.log('server active?'));

app.get('/*', (req, res) => {
  res.send('hihi');
})
