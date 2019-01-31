// import? i think discord stuff
const discord = require ('discord.js');
var client = new discord.Client(); 
const token = process.env.token;

// the prefix for commanding the bot e.g. "lii! advice"
const prefix = "!lii ";

// read json files
const fs = require("fs");
var attacks = require("./attacks.json");
var cards = require("./cards.json");
var constants = require("./constants.json");
var entities = require("./entities.json");
var type, aimTime, fireTime, reloadTime, clip, rangeMin, rangeMax, damage, radius;
var lvl;  // modifier per lvl
var numTargetPriority = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]];
var targetPriority = ["Light Infantry", "Heavy Infantry", "Trucks", "Tanks", "Helicopters", "Planes", "Bunker and Bases"];
var targPrio = "Target Priority: ";

var lastUpdate = "2019/01/22";
client.on("ready", () => {
    console.log("ready");
    client.user.setActivity(prefix+"help for some help XD");
});

client.on("message", (message) => {
    // if bot command prefix is in front
    if (message.content.startsWith(prefix)){
        var command = message.content.slice(prefix.length);
        // help, list the commands
        if(command.startsWith("help")){
            message.channel.send("```============ Commands ============ \n advice: gives helpful life advice \n lookup (mini name) (level): gets the data on the mini of your choice. \n basebomb (base rarity) (base lvl): returns the minimum level of pelican plane and bombers that can kill your base in SD(WIP)```");
        } 
        // gives helpful life advice
        else if (command.startsWith("advice")){
            message.channel.send("lose is improve");
        } 
        // for fargone, who wants to lookup skirts
        else if (command.toLowerCase().startsWith("lookup skirt")){
            let rand = Math.random();
            let skirtresult = "null";

            if (rand < 0.2)
                skirtresult = "something truly nasty, let's not talk about it";
            else if (rand < 0.4)
                skirtresult = "an onion";
            else if (rand < 0.6)
                skirtresult = "something wonderful - it is truly a blessing that the gates of heaven were open for you to see it";
            else if (rand < 0.8)
                skirtresult = "just some plain ole flaps of skin. Nothing to see here";
            else if (rand < 1)
                skirtresult = "i ran out of ideas dm or ping me and i might add it lol";
            //message.channel.send("rand = "+rand);
            message.channel.send("You scuttle around like a rat and lookup a random person's skirt. You find... \n"+skirtresult);
        }
        // the current main feature of the bot: lookup mini stuff
        //===========================================================================//
        else if (command.startsWith("lookup")){
            var uid = "null", uid2 = "null";
            command = command.toLowerCase();
            if (command.search("standard base") != -1){
                uid = "rd_base";       
            } else if (command.search("anti-vehicle base") != -1){
                uid = "rd_baseat";
            } else if (command.search("laser base") != -1){
                uid = "rd_baselaser";
            } else if (command.search("fire base") != -1){
                uid = "rd_baseflame";
            } else if (command.search("anti-air base") != -1){
                uid = "rd_baseaa";
            } else if (command.search("sniper base") != -1){
                uid = "rd_basesniper";
            } else if (command.search("infantry") != -1){
                uid = "rd_rifle";
            } else if (command.search("anti-vehicle infantry") != -1){
                uid = "rd_atinfantry";
            } else if (command.search("attack trooper") != -1){
                uid = "rd_assault";
            } else if (command.search("stationary gunner") != -1){
                uid = "rd_hmg";
            } else if (command.search("laser trooper") != -1){
                uid = "rd_laserrifle";
            } else if (command.search("sniper") != -1){
                uid = "rd_sniper";
            } else if (command.search("engineer") != -1){
                uid = "rd_engineerA";
                uid2 = "rd_engineerB";
            } else if (command.search("heavy infantry") != -1){
                uid = "rd_closequarter";
            } else if (command.search("heavy mortar") != -1){
                uid = "rd_howizter";
            } else if (command.search("pyroblaster") != -1){
                uid = "rd_flamer";
            } else if (command.search("mecha-soldier") != -1 || command.search("mecha soldier") != -1){
                uid = "rd_mechasoldierA";
                uid2 = "rd_mechasoldierB";
            } else if (command.search("attack truck") != -1){
                uid = "rd_mgtruck";
            } else if (command.search("anti-air truck") != -1){
                uid = "rd_aatruck";
            } else if (command.search("hover truck") != -1){
                uid = "rd_hovertruckA";
                uid2 = "rd_hovertruckB";
            } else if (command.search("motorcycle") != -1){
                uid = "rd_bike";
            } else if (command.search("cannon truck") != -1){
                uid = "rd_attruck";
            } else if (command.search("sidecar") != -1){
                uid = "rd_trike";
            } else if (command.search("ambulance") != -1){
                uid = "rd_medictruck";
            } else if (command.search("mine layer") != -1){
                uid = "rd_minelayerA";
                uid2 = "rd_minelayerB";
            } else if (command.search("tempest") != -1){
                uid = "rd_railguntruck";
            } else if (command.search("standard tank") != -1){
                uid = "rd_tank";
            } else if (command.search("shredder") != -1){
                uid = "rd_shredder";
            } else if (command.search("anti-air tank") != -1){
                uid = "rd_aatank";
            } else if (command.search("heavy tank") != -1){
                uid = "rd_heavytank";
            } else if (command.search("mini-tank") != -1){
                uid = "rd_minitank";
            } else if (command.search("rocket artillery tank") != -1){
                uid = "rd_rocketart";
            } else if (command.search("artillery tank") != -1){
                uid = "rd_artillery";
            } else if (command.search("dual-tech tank") != -1){
                uid = "rd_commstankA";
                uid2 = "rd_commstankB";
            } else if (command.search("soundwave tank") != -1){
                uid = "rd_sonictank";
            } else if (command.search("missile defense") != -1){
                uid = "rd_missiledef";
            } else if (command.search("command tank") != -1){
                uid = "rd_commandtank";
            } else if (command.search("laser tank") != -1){
                uid = "rd_lasertank";
            } else if (command.search("rocket copter") != -1){
                uid = "rd_apache";
            } else if (command.search("intercopter") != -1){
                uid = "rd_interceptorA";
                uid2 = "rd_interceptorB";
            } else if (command.search("drone") != -1){
                uid = "rd_drone";
            } else if (command.search("bomb balloon") != -1){
                uid = "rd_balloon";
            } else if (command.search("hunter") != -1){
                uid = "rd_jetA";
                uid2 = "rd_jetB";
            } else if (command.search("fire bomber") != -1){
                uid = "rd_firebomberA";
                uid2 = "rd_firebomberB";
            } else if (command.search("mini tank transporter") != -1){
                uid = "rd_transport";
            } else if (command.search("doomsky") != -1){
                uid = "rd_stealthbomber";
            } 
            //=== end of dominion minis ===\\
            //=== start of most republic minis ===\\
            else if (command.search("tank buster base") != -1){
                uid = "bl_baseat";
            } else if (command.search("photon base") != -1){
                uid = "bl_baselaser";
            } else if (command.search("command base") != -1){
                uid = "bl_basemp";
            } else if (command.search("turret base") != -1){
                uid = "bl_baseaa";
            } else if (command.search("soldier base") != -1){
                uid = "bl_baserifle";
            } else if (command.search("soldier") != -1){
                uid = "bl_rifle";
            } else if (command.search("anti-vehicle infantry") != -1){
                uid = "bl_atinfantry";
            } else if (command.search("assault") != -1){
                uid = "bl_assault";
            } else if (command.search("stationary gunner") != -1){
                uid = "bl_hmg";
            } else if (command.search("photon trooper") != -1){
                uid = "bl_laserrifle";
            } else if (command.search("mechanic") != -1){
                uid = "bl_engineerA";
                uid2 = "bl_engineerB";
            } else if (command.search("blaster") != -1){
                uid = "bl_closequarter";
            } else if (command.search("howitzer") != -1){
                uid = "bl_howizter";
            } else if (command.search("stinger") != -1){
                uid = "bl_aainfantry";
            } else if (command.search("warthog") != -1){
                uid = "bl_warthogA";
                uid2 = "bl_warthogB";
            } else if (command.search("machine gun truck") != -1){
                uid = "bl_mgtruck";
            } else if (command.search("turret truck") != -1){
                uid = "bl_aatruck";
            } else if (command.search("glider") != -1){
                uid = "bl_glider";
            } else if (command.search("tank buster truck") != -1){
                uid = "bl_attruck";
            } else if (command.search("trike") != -1){
                uid = "bl_trike";
            } else if (command.search("apc") != -1 || command.search("a.p.c.") != -1){
                uid = "bl_apcA";
                uid2 = "bl_apcB";
            } else if (command.search("typhoon") != -1){
                uid = "bl_gunshipA";
                uid2 = "bl_gunshipB";
            } else if (command.search("turret tank") != -1){
                uid = "bl_aatank";
            } else if (command.search("ace tank") != -1){
                uid = "bl_acetank";
            } else if (command.search("recon tank") != -1){
                uid = "bl_minitank";
            } else if (command.search("rocket siege tank") != -1){
                uid = "bl_rocketart";
            } else if (command.search("siege tank") != -1){
                uid = "bl_artillery";
            } else if (command.search("dual-tech tank") != -1){
                uid = "bl_commstankA";
                uid2 = "bl_commstankB";
            } else if (command.search("soundwave tank") != -1){
                uid = "bl_sonictank";
            } else if (command.search("general") != -1){
                uid = "bl_general";
            } else if (command.search("commando") != -1){
                uid = "bl_commandoA";
                uid2 = "bl_commandoB";
            } else if (command.search("paratrooper") != -1){
                uid = "bl_paratrooper";
            } else if (command.search("attack helicopter") != -1){
                uid = "bl_apache";
            } else if (command.search("interceptor") != -1){
                uid = "bl_interceptorA";
                uid2 = "bl_interceptorB";
            } else if (command.search("special ops") != -1){
                uid = "bl_specialopsA";
                uid = "bl_specialopsB";
            } else if (command.search("tank buster cannon") != -1){
                uid = "bl_atgun";
            } else if (command.search("jet") != -1){
                uid = "bl_jetA";
                uid2 = "bl_jetB";
            } else if (command.search("transport helicopter") != -1){
                uid = "bl_helitroopA";
                uid2 = "bl_helitroopB";
            } else if (command.search("transport") != -1){
                uid = "bl_transport";
            } else if (command.search("stealth bomber") != -1){
                uid = "bl_stealthbomber";
            } else if (command.search("base") != -1){
                uid = "bl_base";       
            } else if (command.search("bomber") != -1){
                uid = "bl_bomber";
            } 
            //======================== end of republic minis ========================\\
            //======================== start of empire minis ========================\\
            else if (command.search("anti-vehicle fort") != -1 || command.search("anti vehicle fort") != -1){
                uid = "bk_baseat";
            }else if (command.search("command fort") != -1){
                uid = "bk_basemp";
            } else if (command.search("anti-air fort") != -1){
                uid = "bk_baseaa";
            } else if (command.search("marksman fort") != -1){
                uid = "bk_basesniper";
            } else if (command.search("rifleman") != -1){
                uid = "bk_rifle";
            } else if (command.search("rocket soldier") != -1){
                uid = "bk_atinfantry";
            } else if (command.search("elite rifleman") != -1){
                uid = "bk_assault";
            } else if (command.search("tripod gunner") != -1){
                uid = "bk_hmg";
            } else if (command.search("rhino tank") != -1){
                uid = "bk_heavytank";
            } else if (command.search("alligator truck") != -1){
                uid = "bk_minelayerA";
                uid2 = "bk_minelayerB";
            } else if (command.search("armored infantry") != -1){
                uid = "bk_closequarter";
            } else if (command.search("big bertha") != -1){
                uid = "bk_howizter";
            } else if (command.search("missile soldier") != -1){
                uid = "bk_aainfantry";
            } else if (command.search("power armor") != -1){
                uid = "bk_mechasoldierA";
                uid2 = "bk_mechasoldierB";
            } else if (command.search("war hound truck") != -1){
                uid = "bk_mgtruck";
            } else if (command.search("mongoose truck") != -1){
                uid = "bk_aatruck";
            } else if (command.search("stork plane") != -1){
                uid = "bk_glider";
            } else if (command.search("tank buster truck") != -1){
                uid = "bk_attruck";
            } else if (command.search("trike") != -1){
                uid = "bk_trike";
            } else if (command.search("kangaroo truck") != -1){
                uid = "bk_apcA";
                uid2 = "bk_apcB";
            } else if (command.search("dragon tank") != -1){
                uid = "bk_flametank";
            } else if (command.search("giraffe tank") != -1){
                uid = "bk_artillery";
            } else if (command.search("chopper") != -1){
                uid = "bk_heli";
            } else if (command.search("s.a.m.") != -1 || command.search("sam") != -1){
                uid = "bk_missiledef";
            } else if (command.search("tank lady") != -1){
                uid = "bk_mg";
            } else if (command.search("flamethrower") != -1){
                uid = "bk_flamer";
            } else if (command.search("cobra tank") != -1){
                uid = "bk_rocketart";
            } else if (command.search("fox tank") != -1){
                uid = "bk_commstankA";
                uid2 = "bk_commstankB";
            } else if (command.search("combat medic") != -1){
                uid = "bk_medic";
            } else if (command.search("commander") != -1){
                uid = "bk_general";
            } else if (command.search("grenadier") != -1){
                uid = "bk_commandoA";
                uid2 = "bk_commandoB";
            } else if (command.search("airborne trooper") != -1){
                uid = "bk_paratrooper";
            } else if (command.search("first aid fort") != -1){
                uid = "bk_basemedic";
            } else if (command.search("hovering balloon") != -1){
                uid = "bk_balloon";
            } else if (command.search("marksman") != -1){
                uid = "bk_sniper";
            } else if (command.search("anti-vehicle cannon") != -1 || command.search("anti vehicle cannon") != -1){
                uid = "bk_atgun";
            } else if (command.search("crocodile tank") != -1){
                uid = "bk_shredder";
            } else if (command.search("turtle truck") != -1){
                uid = "bk_medictruck";
            } else if (command.search("zeppelin") != -1){
                uid = "bk_zeppelinA";
                uid2 = "bk_zeppelinB";
            } else if (command.search("mammoth tank") != -1){
                uid = "bk_megatankA";
                uid2 = "bk_megatankB";
            } else if (command.search("fort") != -1){
                uid = "bk_base";       
            } else if (command.search("dragon plane") != -1){
                uid = "bk_firebomberA";
                uid2 = "bk_firebomberB";
            } 

            // smallest and simplest names go at the back
            else if (command.search("tank") != -1){
                uid = "bl_tank";
            } else if (command.search("bike") != -1){
                uid = "bl_bike";
            } else if (command.search("helicopter") != -1){
                uid = "bl_heli";
            }

            

            // after getting the uid, get the data
            lvl = parseInt(command.slice(command.length-2)); 
           
            // get title
            let faction = "null";
            if(uid.startsWith("bl"))
                faction = "(Republic) ";
            else if(uid.startsWith("bk"))
                faction = "(Empire) ";
            else if(uid.startsWith("rd"))
                faction = "(Dominion) ";

            let name = command.substring(6, command.length-2);
            // get targetting priority
            // numTargetPriority[0] = attacks[uid].targ_infantry;
            // numTargetPriority[1] = attacks[uid].targ_heavy;
            // numTargetPriority[2] = attacks[uid].targ_truck;
            // numTargetPriority[3] = attacks[uid].targ_tank;
            // numTargetPriority[4] = attacks[uid].targ_heli;
            // numTargetPriority[5] = attacks[uid].targ_plane;
            // numTargetPriority[6] = attacks[uid].targ_base;
           
            // loop through numTargetPriority to get order
            // var max = 0;
            // for(var i = 0; i < numTargetPriority.length; i++){
            //     if(numTargetPriority[i]>max)
            //         max = numTargetPriority[i];
            // }
            // for(var i = 0; i < numTargetPriority.length; i++){
            //     for (var j = 0; j < numTargetPriority.length; j++){
            //         if (numTargetPriority[i] < numTargetPriority[j] && numTargetPriority[i] !== numTargetPriority[j]){
            //             if (numTargetPriority[i] = 0)
            //                 targetPriority[i] = "null";
            //             var temp = targetPriority[i];
            //             targetPriority[i] = targetPriority[j];
            //             targetPriority[j] = temp;
            //         }
            //     }
                
            // }
        
            // loop through the targetPriority to get the strings
            // for(var i = 0; i < targetPriority.length; i++){
            //     if(targetPriority[i] !== "null"){
            //         targPrio += targetPriority[i];
            //     }
            //     else{
            //         message.channel.send("null!");
            //     }
            // }
            
            // TODO: deal with spawns

            var defaultuid = "null";

            if(!isNaN(lvl) && uid !== "null"){
                var dmgOffset = (lvl-1) * attacks[uid].damagePerLvl; 
                
                // special attack types
                var attackType = "";
                if(attacks[uid].isHealing)
                    attackType = "Healing";
                else 
                    attackType = attacks[uid].type;
                var attack2 = "";
                // if uid2 is not null then there is a second attack type
                if(uid2 !== "null"){
                    var dmgOffset2 = (lvl-1) * attacks[uid2].damagePerLvl; 
                    // cut of the A or B of uid for the hp
                    
                    defaultuid = uid.substring(0,uid.length-1);
                    if(attacks[uid2].isHealing){
                        attackType2 = "Healing"
                    } else {
                        attackType2 = attacks[uid2].type;
                    }
                    attack2 = "\nAttack Type 2:\t\t\t\t"+attackType2+"\nDamage:   \t\t\t\t\t"+(attacks[uid2].damage+dmgOffset2)+"\nClip Size:\t\t\t\t\t"+attacks[uid2].clip+"\nAim Time: \t\t\t\t\t"+attacks[uid2].aimTime/1000+"s\nFire Time:\t\t\t\t\t"+attacks[uid2].fireTime/1000+"s\nReload Time:  \t\t\t\t"+attacks[uid2].reloadTime/1000+"s\nRange:\t\t\t\t\t\tfrom "+attacks[uid2]["range"].min/10+"m to "+attacks[uid2]["range"].max/10+"m"+"\nSpread: \t\t\t\t\t  from "+attacks[uid2]["spread"].min/10+"m to "+attacks[uid2]["spread"].max/10+"m"+"\nRadius:   \t\t\t\t\t"+attacks[uid2].radius/10+"m\n-------------------------------------------------\nDamage vs Light Infantry: \t"+attacks[uid2].atk_infantry+"%\n"+"Damage vs Heavy Infantry: \t"+attacks[uid2].atk_heavy+"%\n"+"Damage vs Trucks: \t\t\t"+attacks[uid2].atk_truck+"%\n"+"Damage vs Tanks:  \t\t\t"+attacks[uid2].atk_tank+"%\n"+"Damage vs Helicopters:\t\t"+attacks[uid2].atk_heli+"%\n"+"Damage vs Planes: \t\t\t"+attacks[uid2].atk_plane+"%\n"+"Damage vs Bunkers and Base:   "+attacks[uid2].atk_base+"%\n";
                } else {
                    defaultuid = uid;
                }
                                
                var hpOffset = entities[defaultuid].hpPerLvl*(lvl-1);
                message.channel.send("uid: "+uid+", uid2: "+uid2+", defaultuid: "+defaultuid);
                //message.channel.send("base hp: " +entities[defaultuid].hp+", hpgrowth: "+entities[defaultuid].hpPerLvl);
                if(attacks[uid].type != "spawn")
                    message.channel.send("```============ "+faction+name+" level "+lvl+ " ============ \nAP Cost:  \t\t\t\t\t"+cards[defaultuid].mp+"\nHealth Points:\t\t\t\t"+(entities[defaultuid].hp+hpOffset)+"\n-------------------------------------------------\nAttack Type:  \t\t\t\t"+attackType+"\nDamage:   \t\t\t\t\t"+(attacks[uid].damage+dmgOffset)+"\nClip Size:\t\t\t\t\t"+attacks[uid].clip+"\nAim Time: \t\t\t\t\t"+attacks[uid].aimTime/1000+"s\nFire Time:\t\t\t\t\t"+attacks[uid].fireTime/1000+"s\nReload Time:  \t\t\t\t"+attacks[uid].reloadTime/1000+"s\nRange:\t\t\t\t\t\tfrom "+attacks[uid]["range"].min/10+"m to "+attacks[uid]["range"].max/10+"m"+"\nSpread: \t\t\t\t\t  from "+attacks[uid]["spread"].min/10+"m to "+attacks[uid]["spread"].max/10+"m"+"\nRadius:   \t\t\t\t\t"+attacks[uid].radius/10+"m\n-------------------------------------------------\nDamage vs Light Infantry: \t"+attacks[uid].atk_infantry+"%\n"+"Damage vs Heavy Infantry: \t"+attacks[uid].atk_heavy+"%\n"+"Damage vs Trucks: \t\t\t"+attacks[uid].atk_truck+"%\n"+"Damage vs Tanks:  \t\t\t"+attacks[uid].atk_tank+"%\n"+"Damage vs Helicopters:\t\t"+attacks[uid].atk_heli+"%\n"+"Damage vs Planes: \t\t\t"+attacks[uid].atk_plane+"%\n"+"Damage vs Bunkers and Base:   "+attacks[uid].atk_base+"%\n"+attack2+"```" );
                else{
                    var lvlmultiplier = (4-cards[attacks[uid]["projectile"].uid].rarity)/(4-cards[defaultuid].rarity);
                    var spawnedlvl = Math.ceil(lvl*lvlmultiplier);
                    var spawnedmini = "null"

                    //IMPORTANT NOTE, the following logic may need to be updated if there is a mini that has two different spawns
                    // if(attacks[uid]["projectile"].uid == "bl_rifle" || attacks[uid2]["projectile"].uid == "bl_rifle")
                    //     spawnedmini = "Soldier";
                    // else if(attacks[uid]["projectile"].uid == "bk_rifle" || attacks[uid2]["projectile"].uid == "bk_rifle")
                    //     spawnedmini = "Rifleman";
                    //message.channel.send("lvlmultiplier: "+lvlmultiplier+"spawned uid: "+attacks["bk_glider"]["projectile"].uid);
                    message.channel.send("```============ "+faction+name+" level "+lvl+ " ============ \nAP Cost:  \t\t\t\t\t"+cards[defaultuid].mp+"\nHealth Points:\t\t\t\t"+(entities[defaultuid].hp+hpOffset)+"\n-------------------------------------------------\nAttack Type:  \t\t\t\t"+attackType+"\nClip Size:\t\t\t\t\t"+attacks[uid].clip+"\nAim Time: \t\t\t\t\t"+attacks[uid].aimTime/1000+"s\nFire Time:\t\t\t\t\t"+attacks[uid].fireTime/1000+"s\nReload Time:  \t\t\t\t"+attacks[uid].reloadTime/1000+"s\n Spawned Mini lvl:\t\t\t"+spawnedlvl+"\n"+attack2+"```" );

                    
                }
            } else {
                message.channel.send("Incorrect format. Use "+prefix+"lookup [mini name] [mini lvl]");
            }
        } 
        //===========================================================================//
        // command to check if ur base will die
        else if (command.startsWith("basebomb")){
            var basehp = 1500, totalhp = 0, overtimehp = 0, hpgrowth = 0, pplane_dmg = attacks["bk_bomber"].damage*attacks["bk_bomber"].atk_base/100, bomber_dmg = attacks["bl_bomber"].damage*attacks["bl_bomber"].atk_base/100;
            var pplane_dmggrowth = attacks["bk_bomber"].damagePerLvl, bomber_dmggrowth = attacks["bl_bomber"].damagePerLvl, minBomberlvl = 1, minPPlanelvl = 1;
            var validCommand = true;
            lvl = parseInt(command.slice(command.length-2)); 
            if (command.toLowerCase().search("common") != -1){
                hpgrowth = 75;
            } else if (command.toLowerCase().search("rare") != -1){
                hpgrowth = 100;
            } else if (command.toLowerCase().search("epic") != -1){
                hpgrowth = 150;
            } else {
                validCommand = false;
            }
            // calculate max hp and sudden death hp
            totalhp = basehp+(lvl-1)*hpgrowth;
            overtimehp = Math.floor(constants.match_overtime_base_hp_ratio/100*totalhp);
            // find the required lvl of pelican plane and bomber required to kill base
            for (let i = pplane_dmg*4; i < overtimehp; i += pplane_dmggrowth*4*attacks["bk_bomber"].atk_base/100){
                minPPlanelvl++;
            }
            for (let i = bomber_dmg*4; i < overtimehp; i += bomber_dmggrowth*4*attacks["bl_bomber"].atk_base/100){
                minBomberlvl++;
            }
            //message.channel.send("lvl: "+lvl+", hpgrowth: "+hpgrowth+"actual dmg growth per lvl: "+(bomber_dmggrowth));
            if (!isNaN(lvl) && validCommand)
                message.channel.send("Your base has a max hp of **"+totalhp+"**. At sudden death, it will be set to **"+constants.match_overtime_base_hp_ratio+"%** of it's max hp, which is **"+overtimehp+"**."+" Your base will die in one full bombing (all 4 bombs hit) from a **lvl "+minPPlanelvl+" Pelican Plane** or a **lvl "+minBomberlvl+" Bomber**.");
            else 
                message.channel.send("Invalid command format. Use: "+prefix+"basebomb [base rarity] [base lvl] e.g. "+prefix+"basebomb common 12");
        } 
        // ask user to get help if they type nonsense hehexd
        else {
            message.channel.send("That is an unrecognized command. Use command \""+prefix+"help\" for some help xd.")
        }
        
    }

    // if(message.content.startsWith(prefix + "advice")){
    //     message.reply("lose is improve");
    // }        


    // if(message.content.startsWith(prefix + "lookup")){
    //     data = attacks["bl_base"].aimTime;
    //     message.channel.send("bl_base aimtime: "+data);
        
    // }
});

client.login(token);