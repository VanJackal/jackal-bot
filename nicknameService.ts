import {getNicknames} from "./db/db";
import {Client} from 'discord.js'
import {logger} from './logger'

const UPDATE_INTERVAL = 10000 // set to 1 hour

function init(client:Client){
    setInterval(updateNicknames,UPDATE_INTERVAL, client)
}

async function updateNicknames(client:Client){
    logger.info("Updating Nicknames")
    const nicknames = await getNicknames()
    let guilds = {}

    for (const nickname of nicknames) {
        if (guilds[nickname.serverid]){
            guilds[nickname.serverid].push(nickname)
        } else {
            guilds[nickname.serverid] = [nickname]
        }
    }
    for(const [guildid,nicknameList] of Object.entries(guilds)){
        const guild = await client.guilds.fetch(guildid)
        // @ts-ignore
        for (const nickname of nicknameList){
            const user = await guild.members.fetch(nickname.userid)
            try {
                await user.setNickname(nickname.nickname)
                logger.log("trace",`set nickname for ${nickname.userid} in ${nickname.serverid} to ${nickname.nickname}`)
            } catch (e) {
                logger.warn(`Failed to set nickname for ${nickname.userid} in ${nickname.serverid}\n${e}`)
            }
        }
    }
}



export {
    init
}