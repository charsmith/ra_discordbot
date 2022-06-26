export function formatDate (person, date) {
    const d = new Date(date)
    d.setHours(d.getHours() - 7)
    const date1 = new Date(
        d.toLocaleString('en-US', { timeZone: person.timezone || 'America/Los_Angeles' })
    )
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[date1.getMonth()]
    const day = date1.getDate()
    const year = date1.getFullYear()
    return `${month} ${day}, ${year}`
}
