'use strict'
import { Client, Intents } from 'discord.js'
import 'dotenv/config'
import { handlers } from './handler/index.js'
import fs from 'fs'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.login(process.env.BOT_TOKEN)

client.on('ready', () => console.log('The Bot is ready!'))

function logout () {
    console.log('bye')
    client.destroy()
}

process.on('SIGINT', logout)

let info = {}

if (fs.existsSync(process.env.JSON_PATH)) {
    info = JSON.parse(fs.readFileSync(process.env.JSON_PATH))
    for (const i in info) {
        const response = await fetch(info[i].avatarUrl)
        info[i].avatarBuffer = Buffer.from(await response.arrayBuffer())
    }
}

function serialize () {
    const copied = JSON.parse(JSON.stringify(info))
    for (const i in copied) {
        delete copied[i].avatarBuffer
    }
    fs.writeFileSync(process.env.JSON_PATH, JSON.stringify(copied, null, 2))
}

async function register (msg, raUsername) {
    const username = msg.member.user.username.toLowerCase()
    info[username] = {
        avatarUrl: msg.member.displayAvatarURL(),
        username: msg.member.user.username,
        handle: raUsername,
        timezone: 'America/Los_Angeles',
        lastCheck: 0
    }
    console.log(info[username])
    serialize()
    const response = await fetch(msg.member.displayAvatarURL())
    info[username].avatarBuffer = Buffer.from(await response.arrayBuffer())
}

client.on('message', async (msg) => {
    const text = msg.content.toLowerCase().trim().split(/\s+/)
    let username = msg.member.user.username.toLowerCase()
    let raUsername = username
    if (text[0] === '!register') {
        if (text.length === 2) {
            raUsername = text[1]
        }
        register(msg, raUsername)
    }
    if (text[0] in handlers) {
        if (text.length === 2) {
            username = text[1]
        } else if (!(username in info)) {
            await register(msg, username)
        }
        await handlers[text[0]](info[username], msg)
        serialize()
    }
})
