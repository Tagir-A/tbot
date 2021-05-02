import * as functions from "firebase-functions"
import { Telegraf } from "telegraf"

const BOT_TOKEN = process.env.token || functions.config().tg.token

const bot = new Telegraf(BOT_TOKEN)

bot.command("hello", (ctx) => ctx.reply("Hello, friend!"))
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const hello = functions.https.onRequest(async (request, response) => {
  if (request.query.token && request.query.token === BOT_TOKEN) {
    try {
      await bot.handleUpdate(request.body)
    } catch (error) {
      functions.logger.error("Error while processing", { structuredData: true })
    } finally {
      response.status(200).end()
    }
  } else {
    functions.logger.warn("No auth", { structuredData: true })
    response.status(403).send({
      message: "You lack auth",
    })
  }
})
