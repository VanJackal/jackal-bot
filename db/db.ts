import * as sqlite from "sqlite3"
const db = new sqlite.Database('./jackal.db')
import {logger} from "../logger"

//Initialize database if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE  IF NOT EXISTS nicknames(
        serverid text not null,
        userid text not null,
        steamid text not null,
        appid text not null,
        nickname not null,
        PRIMARY KEY (serverid, userid)
    )`)
})

async function changeNickname(userid, serverid,steamid,appid, nickname){
    logger.info(`Changing nickname for ${userid} in ${serverid}`)
    return new Promise<void>((resolve, reject) => {
        db.run(`INSERT INTO nicknames (serverid, userid, steamid, appid, nickname)
            VALUES (?,?,?,?,?)
            ON CONFLICT(serverid, userid)
            DO UPDATE SET 
            steamid=excluded.steamid,
            appid=excluded.appid,
            nickname=excluded.nickname
        `,
            [serverid, userid, steamid, appid, nickname],
            (err) => {
                if (err) {
                    logger.error(JSON.stringify(err))
                    console.log(err)
                    reject(err)
                } else {
                    resolve()
                }
            })
    })
}

async function getNicknames():Promise<any[]> {
    logger.info("Getting Nicknames")
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM nicknames`,
            (err, rows) => {
                if(err) {
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
    })
}

async function getNickname(userid, serverid) {
    logger.info(`Getting nickname for ${userid} in ${serverid}`)
    return new Promise((resolve, reject) => {
        db.get(`SELECT steamid, appid, nickname FROM nicknames WHERE userid=? AND serverid=?`,
            [userid,serverid],
            (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
    })
}

async function removeNickname(userid,serverid) {
    logger.info(`Removing nickname for ${userid} in ${serverid}`)
    return new Promise<void>((resolve, reject) => {
        db.run(`DELETE FROM nicknames WHERE serverid = ? AND userid = ?`,[serverid,userid],(err) => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

export {
    changeNickname,
    getNicknames,
    getNickname,
    removeNickname
}