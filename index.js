const Discord = require("discord.js");
const request = require('request');

var randomColor = require('randomcolor'); 
var colorutil = require('color-util');

const client = new Discord.Client();


const config = require("./config.json");

function getReadableHashRate(hashrate){
  var i = 0;
  var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH' ];
  while (hashrate > 1000){
      hashrate = hashrate / 1000;
      i++;
  }
  return hashrate.toFixed(2) + byteUnits[i] + '/sec';
}

client.on("ready", () => {
  
  console.log(`Remix Bot Online. Serving ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} server.`); 
  client.user.setActivity(`Making Remix Great Again`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  // if(command === "ping") {
  //   // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
  //   // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
  //   const m = await message.channel.send("Ping?");
  //   m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  // }
  
  // if(command === "say") {
  //   // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
  //   // To get the "message" itself we join the `args` back into a string with spaces: 
  //   const sayMessage = args.join(" ");
  //   // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
  //   message.delete().catch(O_o=>{}); 
  //   // And we get the bot to say the thing: 
  //   message.channel.send(sayMessage);
  // }

  if(command === "about") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send("```My creator is still making me (Alpha Build v0.1.0.1)```");
  }

  if(command === "hashrate") {
    let color = colorutil.color(randomColor()); 
    request(config.info_node_url, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
        
        console.log("The current network hashrate is %s" , getReadableHashRate(body.difficulty / config.coin_target));
          let embed = {
              "title": "Remix Network Information",
              "description": "",
              "url": "https://remixcoin.io",
              "color": `${color.int}`,
              "footer": {
              "icon_url": `${config.info_node_icon_url}`,
              "text": "VOX POPULI, VOX MONETÆ"
              },
              "thumbnail": {
              "url": "https://remixcoin.io"
              },
              "author": {
              "name": "Remix Bot",
              "url": "https://remixcoin.io",
              "icon_url": `${config.info_node_icon_url}`
              },
              "fields": [
              {
                  "name": "Hashrate: 💫",
                  "value": `${getReadableHashRate(body.difficulty / config.coin_target)}`,
                  "inline": true
              },
              {
                  "name": "Difficulty: 👽",
                  "value": `${body.difficulty}`,
                  "inline": true
              }
              ]
    };
    message.channel.send({embed});
    embed = null;
  });
  
}

  if(command === "pools") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 

    
    //Tell the users we are pulling stats
    const m = await message.channel.send("```Pulling stats from the network...```");

    //Loop through each server in the config file and pool the stats
    for (const pool of config.pools) {     
        console.log("Requesting pool stats from %s" , pool.name);
        let color = colorutil.color(randomColor());    
        request(pool.stats_url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        
            let embed = {
                "title": `${pool.name}`,
                "description": `${pool.description}`,
                "url": `${pool.url}`,
                "color": `${color.int}`,
                "footer": {
                "icon_url": `${pool.icon_url}`,
                "text": "VOX POPULI, VOX MONETÆ"
                },
                "thumbnail": {
                "url": `${pool.icon_url}`
                },
                "author": {
                "name": `${pool.name}`,
                "url": `${pool.url}`,
                "icon_url": `${pool.icon_url}`
                },
                "fields": [
                {
                    "name": "Hashrate: 💫",
                    "value": `${getReadableHashRate(body.pool.hashrate)}`,
                    "inline": true
                },
                {
                    "name": "Miners: 👥",
                    "value": `${body.pool.miners}`,
                    "inline": true
                }
                ]
            };

            message.channel.send({embed});
            embed = null;
        });
        
    }

        
            
  }

  if(command === "price") {
  
    //Tell the users we are pulling prices
    const m = await message.channel.send("```Pulling prices from Exchanges...```");

    //Loop through each server in the config file and pool the stats
    for (const exchange of config.exchanges) {     
        console.log("Requesting Price from %s" , exchange.name);
        let color = colorutil.color(randomColor());    
        request(exchange.stats_url, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        
            let embed = {
                "title": `${exchange.name}`,
                "description": `${exchange.description}`,
                "url": `${exchange.url}`,
                "color": `${color.int}`,
                "footer": {
                "icon_url": `${exchange.icon_url}`,
                "text": "VOX POPULI, VOX MONETÆ"
                },
                "thumbnail": {
                "url": `${exchange.icon_url}`
                },
                "author": {
                "name": `${exchange.name}`,
                "url": `${exchange.url}`,
                "icon_url": `${exchange.icon_url}`
                },
                "fields": [
                {
                    "name": "Bid: 💫",
                    "value": `${getReadableHashRate(body.data.bid)}`,
                    "inline": true
                },
                {
                    "name": "Ask: 👥",
                    "value": `${body.data.ask}`,
                    "inline": true
                },
                {
                    "name": "Low: 💫",
                    "value": `${getReadableHashRate(body.data.low)}`,
                    "inline": true
                },
                {
                    "name": "High: 👥",
                    "value": `${body.data.high}`,
                    "inline": true
                },
                {
                    "name": "Volume: 💫",
                    "value": `${getReadableHashRate(body.data.hashrate)}`,
                    "inline": true
                },
                {
                    "name": "Last Buy: 👥",
                    "value": `${body.data.lastBuy}`,
                    "inline": true
                },
                {
                  "name": "Last Sell: 👥",
                  "value": `${body.data.lastSell}`,
                  "inline": true
                }
                ]
            };

            message.channel.send({embed});
            embed = null;
        });
        
    }

        
            
  }


  // if(command === "kick") {
  //   // This command must be limited to mods and admins. In this example we just hardcode the role names.
  //   // Please read on Array.some() to understand this bit: 
  //   // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
  //   if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
  //     return message.reply("Sorry, you don't have permissions to use this!");
    
  //   // Let's first check if we have a member and if we can kick them!
  //   // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
  //   // We can also support getting the member by ID, which would be args[0]
  //   let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  //   if(!member)
  //     return message.reply("Please mention a valid member of this server");
  //   if(!member.kickable) 
  //     return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
  //   // slice(1) removes the first part, which here should be the user mention or ID
  //   // join(' ') takes all the various parts to make it a single string.
  //   let reason = args.slice(1).join(' ');
  //   if(!reason) reason = "No reason provided";
    
  //   // Now, time for a swift kick in the nuts!
  //   await member.kick(reason)
  //     .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
  //   message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  // }
  
  // if(command === "ban") {
  //   // Most of this command is identical to kick, except that here we'll only let admins do it.
  //   // In the real world mods could ban too, but this is just an example, right? ;)
  //   if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
  //     return message.reply("Sorry, you don't have permissions to use this!");
    
  //   let member = message.mentions.members.first();
  //   if(!member)
  //     return message.reply("Please mention a valid member of this server");
  //   if(!member.bannable) 
  //     return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

  //   let reason = args.slice(1).join(' ');
  //   if(!reason) reason = "No reason provided";
    
  //   await member.ban(reason)
  //     .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
  //   message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  // }
  
  // if(command === "purge") {
  //   // This command removes all messages from all users in the channel, up to 100.
    
  //   // get the delete count, as an actual number.
  //   const deleteCount = parseInt(args[0], 10);
    
  //   // Ooooh nice, combined conditions. <3
  //   if(!deleteCount || deleteCount < 2 || deleteCount > 100)
  //     return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
  //   // So we get our messages, and delete them. Simple enough, right?
  //   const fetched = await message.channel.fetchMessages({limit: deleteCount});
  //   message.channel.bulkDelete(fetched)
  //     .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  // }
});

client.login(config.token);