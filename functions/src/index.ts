import * as functions from "firebase-functions"
import { Telegraf } from "telegraf"

const BOT_TOKEN: string = process.env.TOKEN || functions.config().tg.token
const TEST_PAYMENT_TOKEN: string =
  process.env.TEST_PAYMENT_TOKEN || functions.config().tg.test_payment_token

const bot = new Telegraf(BOT_TOKEN)

bot.command("hello", (ctx) => ctx.reply("Hello, friend!"))
bot.command("coffee", (ctx) =>
  ctx.replyWithInvoice({
    title: "Coffee for Tagir",
    description:
      "Show you ❤ for Tagir and ☕. Send him a few Euro to buy a delicious caffeine drink",
    payload: "12345",
    provider_token: TEST_PAYMENT_TOKEN,
    currency: "RUB",
    prices: [{ label: "Cup", amount: 20000 }],
    max_tip_amount: 50000,
  })
)
bot.command("slot", (ctx) =>
  ctx.replyWithDice({
    emoji: "🎰",
  })
)
bot.on("text", (ctx) => {
  ctx.reply(`Did you just say "${ctx.update.message.text}"?`)
})
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
