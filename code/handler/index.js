import { respondCanvas, respondImage, checkAchievements } from './actions.js'

export const handlers = {
    '!canvas': respondCanvas,
    '!html': respondImage,
    '!latest': checkAchievements
}
