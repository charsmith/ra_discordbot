function getUrl (path) {
    const url = new URL('https://retroachievements.org/')
    url.searchParams.append('z', process.env.RA_USER)
    url.searchParams.append('y', process.env.RA_API)
    url.pathname = '/API/' + path
    return url
}

async function readJs (url) {
    console.log(url)
    const response = await fetch(url)
    const json = await response.json()
    // console.log(json);
    console.log('done')
    // console.log(response);
    return json
}

export async function getSummary (user, count) {
    const url = getUrl('API_GetUserSummary.php')
    url.searchParams.append('u', user)
    url.searchParams.append('g', count)
    url.searchParams.append('a', 10)
    return await readJs(url)
}

export async function getAchievements (user, from, to) {
    const url = getUrl('API_GetAchievementsEarnedBetween.php')
    url.searchParams.append('u', user)
    url.searchParams.append('f', from)
    url.searchParams.append('t', to)
    let obj = await readJs(url)
    console.log(obj)
    if (obj.length > 0) {
        obj = obj.filter(a => {
            return a.HardcoreMode === '0'
        })
        console.log(obj)
        obj.sort((a, b) => {
            return new Date(a.Date) > new Date(b.Date) ? 1 : -1
        })
        console.log(obj)
    }
    return obj
}

export async function getAchievementDate (user) {
    const json = await getSummary(user, 3)
    if (json.length === 0) {
        return parseInt((new Date()).getTime() / 1000)
    }
    const times = []
    for (const key in json.RecentAchievements) {
        const ra = json.RecentAchievements[key]
        for (const achieve in ra) {
            console.log(ra[achieve])
            const d = new Date(ra[achieve].DateAwarded)
            d.setHours(d.getHours() - 7)
            times.push(parseInt(d.getTime() / 1000))
        }
    }
    return Math.min(...times)
}
