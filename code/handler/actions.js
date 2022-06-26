import { MessageAttachment } from 'discord.js'
import { getSummary, getAchievements, getAchievementDate } from '../retroachievements/index.js'
import { getHtmlImage, getCanvasImage } from '../display/index.js'

export async function respondImage (person, msg) {
    const json = await getSummary(person.handle, 3)
    const objs = []
    for (const key in json.RecentAchievements) {
        const ra = json.RecentAchievements[key]
        for (const achieve in ra) {
            objs.push(ra[achieve])
        }
    }
    if (objs.length > 0) {
        const images = await getHtmlImage(person, objs)
        const attachments = []
        images.forEach(image => {
            attachments.push(new MessageAttachment(image, `${person.handle}.png`))
        })
        msg.channel.send({
            files: attachments
        })
    }
}

export async function respondCanvas (person, msg) {
    const from = await getAchievementDate(person.handle)
    const to = parseInt((new Date()).getTime() / 1000)
    const objs = await getAchievements(person.handle, from, to)
    if (objs.length > 0) {
        const images = await getCanvasImage(person, objs.slice(-10))
        const attachments = []
        images.forEach(image => {
            attachments.push(new MessageAttachment(image, `${person.handle}.png`))
        })
        msg.channel.send({
            files: attachments
        })
    }
}

export async function checkAchievements (person, msg) {
    const to = parseInt((new Date()).getTime() / 1000)
    let from = person.lastCheck
    person.lastCheck = to
    if (from === 0) {
        from = await getAchievementDate(person.handle)
    }
    const ra = await getAchievements(person.handle, from, to)
    if (ra.length > 0) {
        const images = await getCanvasImage(person, ra.slice(-10))
        const attachments = []
        images.forEach(image => {
            attachments.push(new MessageAttachment(image, `${person.handle}.jpeg`))
        })
        msg.channel.send({
            files: attachments
        })
    }
}
