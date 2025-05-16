const processCwd = process.cwd();
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require("readline");

//const i = 15;
const userSettings = require(`./views/user.json`);
const textRandom = require(`./views/text.json`);

for (let i = 0; i < userSettings.length; i++) {
  if (userSettings[i].status == "true"){  
    let messageTimeout;
    const stringSession = new StringSession(userSettings[i].session);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    (async () => {
      const client = new TelegramClient(
        stringSession,
        userSettings[i].id,
        userSettings[i].hash,
        {
          connectionRetries: 5,
        }
      );

      await client.start({
        phoneNumber: () => new Promise((resolve) => rl.question("Please enter your number: ", resolve)),
        password: () => new Promise((resolve) => rl.question("Please enter your password: ", resolve)),
        phoneCode: () => new Promise((resolve) => rl.question("Please enter the code you received: ", resolve)),
        onError: (err) => console.error(err),
      });

      console.log(`You should now be connected > ${userSettings[i].name}`);

      client.addEventHandler(async (event) => {
      if (event.message) {
        const messageText = event.message.message;

        if (checkForKeywords(messageText, ["Anda bukan bot", "anonxbot"])) {
          //const dataRe = event.message.replyMarkup.rows;          
          await client.sendMessage(6528518111, { message: `[ NOTIF ] reCAPTCHA or Banned ${userSettings[i].name}` }).catch(e => { console.log(`> reCAPTCHA: ${userSettings[i].name}`); });
          return;
        }
        
        if (messageText?.includes("/mdsync")) {
          await client.sendMessage(825312679, { message: "/next" });
        }
        if (messageText?.includes("/stop")) {
      
          if (messageText == "/stop") return;
          if (messageText?.includes("You are in the dialog right now")) return;
        
          const options = textRandom;
          const randomOption = options[Math.floor(Math.random() * options.length)];

            messageTimeout = setTimeout(async () => {
              await client.sendMessage(825312679, { message: "/next" });
            }, 35000);
            
            setTimeout(async () => {
              await client.sendMessage(825312679, { message: randomOption });             
            }, 1500);
          }
          if (event.message == "/mystart") { 
            await client.sendMessage(825312679, { message: "p" }).catch(e => { console.log(`> error: ${userSettings[i].name}`); });;             
            
            //await client.sendMessage(6528518111, { message: `Halo` });
          } 

          if (messageText?.includes("/search")) {        
            if (messageText == "/search") return;
            if (!messageText?.includes("Type /search to find a partner")) {
              setTimeout(async () => {
                await client.sendMessage(825312679, { message: "/next" });
              }, 15000);
              clearTimeout(messageTimeout);
              messageTimeout = null;
            }      
          }
        }
      });
      if (userSettings[i].session == ""){
        //await client.sendMessage(825312679, { message: "/next" }).catch(e => console.log(e));
        console.log(`${i + 1} -> ${client.session.save()}`);
      }
    })();

    function checkForKeywords(message, keywords) {
      try {
        return keywords.some((keyword) => message?.includes(keyword));
      } catch(e) { }
    }
  }
}

//require('./main.js');