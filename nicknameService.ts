import {getNicknames,getNickname} from "./db/db";
import {Client, Guild} from 'discord.js'
import {logger} from './logger'
import {getHours} from './steamWrapper'

const UPDATE_INTERVAL = 12 * 3600 * 1000 // 12 * seconds per hour * ms per s = 12 hours

function init(client:Client){
    setInterval(updateNicknames,UPDATE_INTERVAL, client)
}

async function setNickname(guild: Guild, nickname: any) {
    const user = await guild.members.fetch(nickname.userid)
    try {
        await user.setNickname(await getNicknameString(nickname.steamid, nickname.appid, nickname.nickname))
        logger.log("trace", `set nickname for ${nickname.userid} in ${nickname.serverid} to ${nickname.nickname}`)
    } catch (e) {
        logger.warn(`Failed to set nickname for ${nickname.userid} in ${nickname.serverid}\n${e}`)
    }
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
            await setNickname(guild, nickname);
        }
    }
}

async function getNicknameString(steamid:string,appid:string,nickname:string) {
    const hours = await getHours(steamid,appid)
    const nick =  nickname.replace("%HOURS%", hours.toString())
    return nick
}

async function updateNickname(client, userid,serverid) {
    const nickname = await getNickname(userid,serverid)
    const guild = await client.guilds.fetch(serverid)
    await setNickname(guild,nickname)
}



export {
    init,
    updateNickname
}