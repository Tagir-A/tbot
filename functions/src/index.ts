import * as functions from "firebase-functions"
import { Telegraf, Scenes } from "telegraf"

import { DONAT_WIZARD_SCENE_ID, donatWizardScene } from "./DonatScene"
import { superWizard } from "./TestScene"
import firestoreSession from "telegraf-session-firestore"
import * as admin from "firebase-admin"

admin.initializeApp()

const db = admin.firestore()

const BOT_TOKEN: string = process.env.TOKEN || functions.config().tg.token
const TEST_PAYMENT_TOKEN: string =
  process.env.TEST_PAYMENT_TOKEN || functions.config().tg.test_payment_token

const STRIPE_TEST_TOKEN: string =
  process.env.STRIPE_TEST_TOKEN || functions.config().tg.stripe_test_token

const bot = new Telegraf<Scenes.WizardContext>(BOT_TOKEN)
const stage = new Scenes.Stage<Scenes.WizardContext>([
  superWizard,
  donatWizardScene,
])
bot.use(firestoreSession(db.collection("sessions")))

bot.use(stage.middleware())

bot.command("hello", (ctx) => ctx.reply("Hello, friend!"))

bot.command("coffee", (ctx) => {
  switch (ctx.from.language_code) {
    case "en":
    case "de":
      ctx.replyWithInvoice({
        title: "Coffee for Tagir",
        description:
          "Show you ❤ for Tagir and ☕. Send him a few Euro to buy a delicious caffeine drink",
        payload: "12345",
        provider_token: STRIPE_TEST_TOKEN,
        currency: "EUR",
        prices: [{ label: "Cup", amount: 200 }],
        max_tip_amount: 500,
      })
      break
    case "ru":
      ctx.replyWithInvoice({
        title: "Кофе для Тагира",
        description: "Покажи свою ❤ Тагиру и оплати его ☕",
        payload: "12345",
        provider_token: TEST_PAYMENT_TOKEN,
        currency: "RUB",
        prices: [{ label: "Cup", amount: 20000 }],
        max_tip_amount: 50000,
      })
      break

    default:
      ctx.reply("Sorry, currently only 🇩🇪, 🇷🇺, and 🇬🇧 locales are supported")
      break
  }
})

bot.command("donat_ad", async (ctx) => {
  ctx.scene.enter(DONAT_WIZARD_SCENE_ID)
})

bot.command("test_wizard", (ctx) => {
  ctx.scene.enter("super-wizard")
})

bot.command("slot", (ctx) =>
  ctx.replyWithDice({
    emoji: "🎰",
  })
)

bot.on("pre_checkout_query", (ctx) => {
  ctx.answerPreCheckoutQuery(true)
  // if (ctx.from.first_name === "Tagir") {
  // } else {
  //   ctx.answerPreCheckoutQuery(
  //     false,
  //     "Currently only payments from Tagir are supported"
  //   )
  // }
})

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
      functions.logger.error(
        "Error while processing",
        { structuredData: true },
        error
      )
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
