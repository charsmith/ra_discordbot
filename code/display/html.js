import nodeHtmlToImage from 'node-html-to-image'
import { formatDate } from './utils.js'

function getHtml () {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
        body {
            font-family: "Poppins", Arial, Helvetica, sans-serif;
            background: rgb(22, 22, 22);
            color: #fff;
            max-width: 460px;
        }

        .achievement {
            padding: 0px;
            display: flex;
            background-color2: yellow;
            flex-flow: row wrap;
            width: 100%;
        }

        .row1 {
            background-color2: red;
            flex-flow: column;
            align-items: center;
            width: 220px;
        }
        h6 {
            text-overflow: ellipsis;
            width: 100%;
            max-width: 200px;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 0px;
            margin-top: 20px;
        }
        .row2 {
            background-color2: blue;
            align-items: center;
            padding: 20px;
        }
        .app {
            max-width: 600px;
            padding: 20px;
            display: flex;
            flex-direction: row;
            border-top: 3px solid rgb(16, 180, 209);
            background: rgb(31, 31, 31);
            align-items: center;
        }

        .avatar {
            width: 50px;
            height: 50px;
            margin-right: 20px;
            border-radius: 50%;

            padding: 5px;
        }
    </style>
  </head>
  <body>
      <div class="app">
          <div>
              <img class='avatar' src="{{avatar}}" />
          </div>
          <div class="achievement">
              <div class='row1'>
                  <h4>{{Title}}</h4>
                  <h6>{{Description}}</h6>
                  <h6>
                       {{Points}} points<br/>
                      <i>{{GameTitle}}</i>
                  </h6>
                  <h6>Achieved: {{date}}</h6>
              </div>
              <div class='row2'>
                  <img src="https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/{{BadgeName}}.png" />
              </div>
          </div>

      </div>
  </body>
</html>
 `
}

export default async function getImage (person, objs) {
    const content = []
    objs.forEach(obj => {
        let date = formatDate(person, obj.Date)
        if ('Date' in obj) {
            date = obj.Date
        } else {
            date = obj.DateAwarded
        }
        content.push({
            date,
            avatar: person.avatarUrl,
            Title: obj.Title,
            Description: obj.Description,
            Points: obj.Points,
            GameTitle: obj.GameTitle,
            BadgeName: obj.BadgeName
        })
    })
    console.log(objs)
    try {
        const output = await nodeHtmlToImage({
            html: getHtml(),
            puppeteerArgs: {
                args: ['--no-sandbox']
            },
            content
        })
        return output
    } catch (exception) {
        console.log(exception)
    }
}
