const DS = require('discord.js');
const CFG = require('./config/config.json');
const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {MongoClient, ObjectId} = require('mongodb');
const fs = require('node:fs');

let bot = new DS.Client({intents: ['GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILDS']})
let PR = CFG.prefix
let DB = new MongoClient('mongodb://localhost')

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
}

const rest = new REST({version: '9'}).setToken(CFG.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(CFG.clientId, CFG.guildId),
            {body: commands}
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

function formatTemplate(name, surname, sex, dn, faction, residence, profession, id){
    return "======================================\n" +
    " \n" +
    "                      \t\t\tССЧР - URSC\n" +
    "\n" +
    "     Союз Советских Чернарусски Республики   \n" +
    " Union des Républiques Soviétiques Chernares \n" +
    "\n========================================\n" +
    "    ПАССПОРТ     --―――――--    PASSEPORT    \n" +
    "--―――――――――――――――――――--\n\n" +
    "Nom: " + name + "\n" +
    "Prénom: " + surname + "\n" +
    "Sexe: " + sex + "\n" +
    "D.N: " + dn + "\n" + 
    "Oblast : " + faction + "\n" +
    "Résidence: " + residence + "\n" +
    "Profession : "+ profession +"\n\n" +
    "--――――――――――――――――――--\n\n" +
    "N° ID : " + id + "\n" 
}

bot.on('interactionCreate', async (it)=>{
    if(!it.isCommand()) return;
    const command  = it.commandName
    if (command === 'new') {
        let name_, surname_, sex_, dn_, faction_, residence_, pro_, id_;
        let olist = [name_, surname_, sex_, dn_, faction_, residence_, pro_]
        it.options._hoistedOptions.forEach((option)=>{
            switch(option.name){
                case 'nom':
                    name_ = option.value
                    break;
                case 'prenom':
                    surname_ = option.value
                    break;
                case 'sexe':
                    sex_ = option.value
                    break;
                case 'dn':
                    dn_ = option.value
                    break;
                case 'faction':
                    faction_ = option.value
                    break;
                case 'residence':
                    residence_ = option.value
                    break;
                case 'profession':
                    pro_ = option.value
                    break;
                default:
                    break;
            }
        })
        olist.map((e)=>{if(e === null || e === '/') e = 'N/A'})
        DB.db('pass').collection('emitted').findOne({"name": name_, "surname": surname_}, async (err, doc)=>{
            if(doc === null){
                let new_pass = {
                    name: name_,
                    surname: surname_,
                    sex: sex_,
                    dn: dn_,
                    faction: faction_,
                    residence: residence_,
                    profession: pro_||"N/A"
                }
                DB.db('pass').collection('emitted').insertOne(new_pass, (err)=>{
                    if(err) throw err;
                })
                DB.db('pass').collection('emitted').findOne({"name": name_, "surname": surname_}, (err, d)=>{
                    if(err) throw err;
                    it.reply( "```txt\n" + formatTemplate(name_, surname_, sex_, dn_, faction_, residence_, pro_, d._id) +"\n```")
                })
            }else {
                await it.reply("Cette identité est déjà enregistrée.\nID: " + doc._id )
            }
        })
    }else if(command === "check"){
        DB.db('pass').collection('emitted').findOne({"_id": ObjectId(it.options._hoistedOptions[0].value)}, (err, doc)=>{
            it.reply("```txt\n" + formatTemplate(doc.name, doc.surname, doc.sex, doc.dn,doc.faction,  doc.residence, doc.profession, doc._id) + "\n```")
        })
    }
})

bot.on("ready",  ()=>{
    console.log("Ready..... (prefix : '"+PR+"')")
})

bot.login(CFG.token).then(async ()=> {
    await DB.connect();
    console.log("Connected ....")}
);