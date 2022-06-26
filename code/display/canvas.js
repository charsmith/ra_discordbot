import { createCanvas, Image } from '@napi-rs/canvas'
import { formatDate } from './utils.js'

function createImage (avatar, objs) {
    const images = []
    const lineHeight = 15
    console.log(objs)
    objs.forEach(achievement => {
        const canvas = createCanvas(460, 192)
        const context = canvas.getContext('2d')
        let textY = 40

        context.fillStyle = '#161616'
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = '#10b4d1'
        context.fillRect(0, 0, canvas.width, 3)

        // Title
        context.fillStyle = 'white'
        context.font = '20px arial'
        context.fillText(achievement.Title, 90, textY)
        textY += 2 * lineHeight

        // Descritiopn
        context.font = '13px arial'
        let firstLine = ''
        let secondLine = ' '
        achievement.Description.split(' ').every(word => {
            if (context.measureText(firstLine + ' ' + word).width > 260) {
                secondLine = achievement.Description.slice(firstLine.length + 1)
                return false
            } else {
                if (firstLine.length !== 0) {
                    firstLine += ' '
                }
                firstLine += word
            }
            return true
        })

        context.fillText(firstLine, 90, textY)
        textY += lineHeight
        context.fillText(secondLine, 90, textY)
        textY += 2 * lineHeight

        // Points
        context.fillText(achievement.Points + ' point(s)', 90, textY)
        textY += lineHeight

        // GameTitle
        context.fillText(achievement.ConsoleName + ' - ' + achievement.GameTitle, 90, textY)
        textY += 2 * lineHeight

        // Date
        context.fillText('Achieved: ' + achievement.date, 90, textY)

        // achievement image
        const thumbnail = new Image()
        thumbnail.src = achievement.badgeBuffer

        context.drawImage(thumbnail, 360, 50, 64, 64)

        /*
 * Don't like how this looks, too busy.
        response = await fetch(`https://s3-eu-west-1.amazonaws.com/i.retroachievements.org${achievement.GameIcon}`);
        thumbnail = new Image();
        thumbnail.src = Buffer.from(await response.arrayBuffer());

        context.drawImage(thumbnail, 360, 120, 64, 64);
*/

        context.beginPath()
        context.arc(45, 96, 25, 0, Math.PI * 2, true)
        context.closePath()
        context.clip()

        context.drawImage(avatar, 20, 71, 50, 50)

        images.push(canvas.toBuffer('image/png'))
    })
    return images
}

export default async function getImage (person, objs) {
    const avatar = new Image()
    avatar.src = person.avatarBuffer

    await Promise.all(objs.map(async achievement => {
        achievement.date = formatDate(person, achievement.Date || achievement.DateAwarded)
        const response = await fetch(`https://s3-eu-west-1.amazonaws.com/i.retroachievements.org${achievement.BadgeURL}`)
        achievement.badgeBuffer = Buffer.from(await response.arrayBuffer())

    }))
    try {
        return createImage(avatar, objs)
    } catch (exception) {
        console.log(exception)
    }
}
