import axios from 'axios'
import {logger} from './logger'
const STEAM_API = "http://api.steampowered.com"
//API Calls
const getGames = async (steamid) => {
	const url = `${STEAM_API}/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamid}&format=json&include_played_free_games=true`
	logger.debug(`Getting ${url}`)
	const res = await axios.get(url)
	return  res.data.response
}

//Util Functions
async function topTen(steamid):Promise<[{appid:number,playtime:number}]|[]>{
	let games = (await getGames(steamid)).games
	let gamesSorted = games.sort((a,b) => {
	    return b.playtime_forever - a.playtime_forever
	})
	if(gamesSorted.length <=0) return []
	let top = []
	for (let i = 0; i < (gamesSorted.length >= 10 ? 10 : gamesSorted.length); i++) {
		top.push({
			appid:gamesSorted[i].appid,
			playtime:gamesSorted[i].playtime_forever/60 //divide to get hours
		})
	}

	// @ts-ignore
	return top
}

async function getHours(steamid,appid) {
	logger.debug(`getting ${steamid}'s hours for ${appid}`)
	const games = (await getGames(steamid)).games
	const playtime = games.find((game) => {
	    return game.appid === parseInt(appid)
	}).playtime_forever
	return Math.round(playtime/60)
}


export {
	getGames,
	topTen,
	getHours
}