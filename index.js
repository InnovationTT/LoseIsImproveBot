// import? i think discord stuff
const discord = require ('discord.js');
var client = new discord.Client(); 
const token = process.env.token;

// the prefix for commanding the bot e.g. "lii! advice"
const prefix = "!";

// read json files
const fs = require("fs");
var attacks = require("./attacks.json");
var cards = require("./cards.json");
var constants = require("./constants.json");
var type, aimTime, fireTime, reloadTime, clip, rangeMin, rangeMax, damage, radius;
var lvl;  // modifier per lvl
var numTargetPriority = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]];
var targetPriority = ["Light Infantry", "Heavy Infantry", "Trucks", "Tanks", "Helicopters", "Planes", "Bunker and Bases"];
var targPrio = "Target Priority: ";
var uid = "null", uid2 = "";
var lastUpdate = "2019/01/22";
client.on("ready", () => {
    console.log("ready");
    client.user.setActivity("last updated 2019/01/22");
});

client.on("message", (message) => {
    // if bot command prefix is in front
    if (message.content.startsWith(prefix)){
        var command = message.content.slice(prefix.length);
        // help, list the commands
        if(command.startsWith("help")){
            message.channel.send("```============ Commands ============ \n advice: gives helpful life advice \n lookup (mini name) (level): gets the data on the mini of your choice. (WIP)```");
        } 
        // gives helpful life advice
        else if (command.startsWith("advice")){
            message.channel.send("lose is improve");
        } 
        // the current main feature of the bot: lookup mini stuff
        //===========================================================================//
        else if (command.startsWith("lookup")){
            if (command.search("Standard Base") != -1){
                uid = "rd_base";       
            } else if (command.search("Anti-Vehicle Base") != -1){
                uid = "rd_baseat";
            } else if (command.search("Laser Base") != -1){
                uid = "rd_baselaser";
            } else if (command.search("Fire Base") != -1){
                uid = "rd_baseflame";
            } else if (command.search("Anti-Air Base") != -1){
                uid = "rd_baseaa";
            } else if (command.search("Sniper Base") != -1){
                uid = "rd_basesniper";
            } else if (command.search("Infantry") != -1){
                uid = "rd_rifle";
            } else if (command.search("Anti-Vehicle Infantry") != -1){
                uid = "rd_atinfantry";
            } else if (command.search("Attack Trooper") != -1){
                uid = "rd_assault";
            } else if (command.search("Stationary Gunner") != -1){
                uid = "rd_hmg";
            } else if (command.search("Laser Trooper") != -1){
                uid = "rd_laserrifle";
            } else if (command.search("Sniper") != -1){
                uid = "rd_sniper";
            } else if (command.search("Engineer") != -1){
                uid = "rd_engineerA";
                uid2 = "rd_engineerB";
            } else if (command.search("Heavy Infantry") != -1){
                uid = "rd_closequarter";
            } else if (command.search("Heavy Mortar") != -1){
                uid = "rd_howizter";
            } else if (command.search("Pyroblaster") != -1){
                uid = "rd_flamer";
            } else if (command.search("Mecha-Soldier") != -1){
                uid = "rd_mechasoldierA";
                uid2 = "rd_mechasoldierB";
            } else if (command.search("Attack Truck") != -1){
                uid = "rd_mgtruck";
            } else if (command.search("Anti-Air Truck") != -1){
                uid = "rd_aatruck";
            } else if (command.search("Hover Truck") != -1){
                uid = "rd_hovertruckA";
                uid2 = "rd_hovertruckB";
            } else if (command.search("Motorcycle") != -1){
                uid = "rd_bike";
            } else if (command.search("Cannon Truck") != -1){
                uid = "rd_attruck";
            } else if (command.search("Sidecar") != -1){
                uid = "rd_trike";
            } else if (command.search("Ambulance") != -1){
                uid = "rd_medictruck";
            } else if (command.search("Mine Layer") != -1){
                uid = "rd_minelayerA";
                uid2 = "rd_minelayerB";
            } else if (command.search("Tempest") != -1){
                uid = "rd_railguntruck";
            } else if (command.search("Standard Tank") != -1){
                uid = "rd_tank";
            } else if (command.search("Artillery Tank") != -1){
                uid = "rd_artillery";
            } else if (command.search("Shredder") != -1){
                uid = "rd_shredder";
            } else if (command.search("Anti-Air Tank") != -1){
                uid = "rd_aatank";
            } else if (command.search("Heavy Tank") != -1){
                uid = "rd_heavytank";
            } else if (command.search("Mini-Tank") != -1){
                uid = "rd_minitank";
            } else if (command.search("Rocket Artillery Tank") != -1){
                uid = "rd_rocketart";
            } else if (command.search("Dual-Tech Tank") != -1){
                uid = "rd_commstankA";
                uid2 = "rd_commstankB";
            } else if (command.search("Soundwave Tank") != -1){
                uid = "rd_sonictank";
            } else if (command.search("Missile Defense") != -1){
                uid = "rd_missiledef";
            } else if (command.search("Command Tank") != -1){
                uid = "rd_commandtank";
            } else if (command.search("Laser Tank") != -1){
                uid = "rd_lasertank";
            } else if (command.search("Rocket Copter") != -1){
                uid = "rd_apache";
            } else if (command.search("Intercopter") != -1){
                uid = "rd_interceptorA";
                uid2 = "rd_interceptorB";
            } else if (command.search("Drone") != -1){
                uid = "rd_drone";
            } else if (command.search("Bomb Balloon") != -1){
                uid = "rd_balloon";
            } else if (command.search("Hunter") != -1){
                uid = "rd_jetA";
                uid2 = "rd_jetB";
            } else if (command.search("Fire Bomber") != -1){
                uid = "rd_firebomberA";
            } else if (command.search("Mini Tank Transporter") != -1){
                uid = "rd_transport";
            } else if (command.search("Doomsky") != -1){
                uid = "rd_stealthbomber";
            } 
            //=== end of dominion minis ===\\
            else if (command.search("Tank Buster Base") != -1){
                uid = "bl_baseat";
            } else if (command.search("Photon Base") != -1){
                uid = "bl_baselaser";
            } else if (command.search("Command Base") != -1){
                uid = "bl_basemp";
            } else if (command.search("Turret Base") != -1){
                uid = "bl_baseaa";
            } else if (command.search("Sniper Base") != -1){
                uid = "bl_basesniper";
            } else if (command.search("Soldier Base") != -1){
                uid = "bl_baserifle";
            } else if (command.search("Soldier") != -1){
                uid = "bl_rifle";
            } else if (command.search("Anti-Vehicle Infantry") != -1){
                uid = "bl_atinfantry";
            } else if (command.search("Attack Trooper") != -1){
                uid = "bl_assault";
            } else if (command.search("Stationary Gunner") != -1){
                uid = "bl_hmg";
            } else if (command.search("Photon Trooper") != -1){
                uid = "bl_laserrifle";
            } else if (command.search("Mechanic") != -1){
                uid = "bl_engineerA";
                uid2 = "bl_engineerB";
            } else if (command.search("Blaster") != -1){
                uid = "bl_closequarter";
            } else if (command.search("Howitzer") != -1){
                uid = "bl_howizter";
            } else if (command.search("Stinger") != -1){
                uid = "bl_aainfantry";
            } else if (command.search("Warthog") != -1){
                uid = "bl_warthogA";
                uid2 = "bl_warthogB";
            } else if (command.search("Machine Gun Truck") != -1){
                uid = "bl_mgtruck";
            } else if (command.search("Turret Truck") != -1){
                uid = "bl_aatruck";
            } else if (command.search("Glider") != -1){
                uid = "bl_glider";
            } else if (command.search("Tank Buster Truck") != -1){
                uid = "bl_attruck";
            } else if (command.search("Trike") != -1){
                uid = "bl_trike";
            }else if (command.search("APC") != -1 || command.search("A.P.C.") != -1){
                uid = "bl_apcA";
                uid2 = "bl_apcB";
            } else if (command.search("Typhoon") != -1){
                uid = "bl_gunshipA";
                uid2 = "bl_gunshipB";
            }else if (command.search("Siege Tank") != -1){
                uid = "bl_artillery";
            } else if (command.search("Helicopter") != -1){
                uid = "bl_heli";
            } else if (command.search("Turret Tank") != -1){
                uid = "bl_aatank";
            } else if (command.search("Ace Tank") != -1){
                uid = "bl_acetank";
            } else if (command.search("Recon Tank") != -1){
                uid = "bl_minitank";
            } else if (command.search("Rocket Siege Tank") != -1){
                uid = "bl_rocketart";
            } else if (command.search("Dual-Tech Tank") != -1){
                uid = "bl_commstankA";
                uid2 = "bl_commstankB";
            } else if (command.search("Soundwave Tank") != -1){
                uid = "bl_sonictank";
            } else if (command.search("General") != -1){
                uid = "bl_general";
            } else if (command.search("Commando") != -1){
                uid = "bl_commandoA";
                uid2 = "bl_commandoB";
            } else if (command.search("Paratrooper") != -1){
                uid = "bl_paratrooper";
            } else if (command.search("Attack Helicopter") != -1){
                uid = "bl_apache";
            } else if (command.search("Interceptor") != -1){
                uid = "bl_interceptorA";
                uid2 = "bl_interceptorB";
            } else if (command.search("Special Ops") != -1){
                uid = "bl_specialops";
            } else if (command.search("Tank Buster Cannon") != -1){
                uid = "bl_atgun";
            } else if (command.search("Jet") != -1){
                uid = "bl_jetA";
                uid2 = "bl_jetB";
            } else if (command.search("Transport Helicopter") != -1){
                uid = "bl_helitroopA";
                uid2 = "bl_helitroopB";
            } else if (command.search("Transport") != -1){
                uid = "bl_transport";
            } else if (command.search("Stealth Bomber") != -1){
                uid = "bl_stealthbomber";
            } else if (command.search("Base") != -1){
                uid = "bl_base";       
            } else if (command.search("Bomber") != -1){
                uid = "bl_bomber";
            } 
            //======================== end of republic minis ========================\\
            //======================== START of EMPIRE minis ========================\\
            else if (command.search("Tank") != -1){
                uid = "bl_tank";
            } else if (command.search("Bike") != -1){
                uid = "bl_bike";
            } 
            // after getting the uid, get the data
            lvl = parseInt(command.slice(command.length-2)); 
            var dmgOffset = (lvl-1) * attacks[uid].damagePerLvl; 
            if(uid2 !== "")
                var dmgOffset2 = (lvl-1) * attacks[uid2].damagePerLvl; 
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
            numTargetPriority[0] = attacks[uid].targ_infantry;
            numTargetPriority[1] = attacks[uid].targ_heavy;
            numTargetPriority[2] = attacks[uid].targ_truck;
            numTargetPriority[3] = attacks[uid].targ_tank;
            numTargetPriority[4] = attacks[uid].targ_heli;
            numTargetPriority[5] = attacks[uid].targ_plane;
            numTargetPriority[6] = attacks[uid].targ_base;
           
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
            if(uid != "null"){
                var attackType = "";
                if(attacks[uid].isHealing)
                    attackType = "Healing";
                else 
                    attackType = attacks[uid].type;
                var attack2 = "";
                if(uid2 !== ""){
                    if(attacks[uid2].isHealing){
                        attackType2 = "Healing"
                    } else {
                        attackType2 = attacks[uid2].type;
                    }
                    attack2 = "\nAttack Type 2:\t\t\t\t"+attackType2+"\nDamage:   \t\t\t\t\t"+(attacks[uid2].damage+dmgOffset2)+"\nAim Time: \t\t\t\t\t"+attacks[uid2].aimTime/1000+"s\nFire Time:\t\t\t\t\t"+attacks[uid2].fireTime/1000+"s\nRange:\t\t\t\t\t\tfrom "+attacks[uid2]["range"].min/10+"m to "+attacks[uid2]["range"].max/10+"m"+"\nSpread: \t\t\t\t\t  from "+attacks[uid2]["spread"].min/10+"m to "+attacks[uid2]["spread"].max/10+"m"+"\nRadius:   \t\t\t\t\t"+attacks[uid2].radius/10+"m\nDamage vs Light Infantry: \t"+attacks[uid2].atk_infantry+"%\n"+"Damage vs Heavy Infantry: \t"+attacks[uid2].atk_heavy+"%\n"+"Damage vs Trucks: \t\t\t"+attacks[uid2].atk_truck+"%\n"+"Damage vs Tanks:  \t\t\t"+attacks[uid2].atk_tank+"%\n"+"Damage vs Helicopters:\t\t"+attacks[uid2].atk_heli+"%\n"+"Damage vs Planes: \t\t\t"+attacks[uid2].atk_plane+"%\n"+"Damage vs Bunkers and Base:   "+attacks[uid2].atk_base+"%\n";
                }
                message.channel.send(numTargetPriority[3][1]);
                message.channel.send("```============ "+faction+name+" level "+lvl+ " ============ \nAttack Type:  \t\t\t\t"+attackType+"\nDamage:   \t\t\t\t\t"+(attacks[uid].damage+dmgOffset)+"\nAim Time: \t\t\t\t\t"+attacks[uid].aimTime/1000+"s\nFire Time:\t\t\t\t\t"+attacks[uid].fireTime/1000+"s\nRange:\t\t\t\t\t\tfrom "+attacks[uid]["range"].min/10+"m to "+attacks[uid]["range"].max/10+"m"+"\nSpread: \t\t\t\t\t  from "+attacks[uid]["spread"].min/10+"m to "+attacks[uid]["spread"].max/10+"m"+"\nRadius:   \t\t\t\t\t"+attacks[uid].radius/10+"m\nDamage vs Light Infantry: \t"+attacks[uid].atk_infantry+"%\n"+"Damage vs Heavy Infantry: \t"+attacks[uid].atk_heavy+"%\n"+"Damage vs Trucks: \t\t\t"+attacks[uid].atk_truck+"%\n"+"Damage vs Tanks:  \t\t\t"+attacks[uid].atk_tank+"%\n"+"Damage vs Helicopters:\t\t"+attacks[uid].atk_heli+"%\n"+"Damage vs Planes: \t\t\t"+attacks[uid].atk_plane+"%\n"+"Damage vs Bunkers and Base:   "+attacks[uid].atk_base+"%\n"+attack2+"```" );
                
            }
        } 
        //===========================================================================//
        // command to check if ur base will die
        else if (command.startsWith("basebomb")){
            var basehp = 1500, totalhp = 0, overtimehp = 0, hpgrowth = 0, pplane_dmg = attacks["bk_bomber"].damage*attacks["bk_bomber"].atk_base/100, bomber_dmg = attacks["bl_bomber"].damage*attacks["bl_bomber"].atk_base/100;
            var pplane_dmggrowth = attacks["bk_bomber"].damagePerLvl, bomber_dmggrowth = attacks["bk_bomber"].damagePerLvl, minBomberlvl = 0, minPPlanelvl = 0;
            lvl = parseInt(command.slice(command.length-2)); 
            if (command.search("common" != -1)){
                hpgrowth = 75;
            } else if (command.search("rare" != -1)){
                hpgrowth = 100;
            } else if (command.search("epic" != -1)){
                hpgrowth = 150;
            } else {
                message.channel.send("Invalid command format. Use: "+prefix+"basebomb [base rarity] [base lvl]");
            }
            // calculate max hp and sudden death hp
            totalhp = (basehp+lvl*hpgrowth);
            overtimehp = (constants.match_overtime_base_hp_ratio/100*totalhp);
            // find the required lvl of pelican plane and bomber required to kill base
            for (let i = pplane_dmg*4; i <= overtimehp; i += pplane_dmggrowth*4*attacks["bk_bomber"].atk_base/100){
                minPPlanelvl++;
            }
            for (let i = bomber_dmg*4; i <= overtimehp; i += bomber_dmggrowth*4*attacks["bl_bomber"].atk_base/100){
                minBomberlvl++;
            }
            message.channel.send("Your base has a max hp of "+totalhp+". At sudden death, it will be set to "+constants.match_overtime_base_hp_ratio+"% of it's max hp, which is "+overtimehp+".\n"+" Your base will die in one full bombing (all 4 bombs hit) from a lvl "+minPPlanelvl+" Pelican Plane or a lvl "+minBomberlvl+" Bomber.");
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