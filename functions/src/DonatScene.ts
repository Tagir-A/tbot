import { Scenes, Markup, Composer } from "telegraf"
import { Message } from "typegram"

type StreamUrl = {
  platform: string
  url: string
}

type DonationUrl = {
  platform: string
  url: string
}

type StreamersCollection = {
  [key: string]: {
    name: string
    streamUrls: StreamUrl[]
    donationUrls: DonationUrl[]
  }
}

const STREAMERS: StreamersCollection = {
  necrotal: {
    name: "necrotal",
    streamUrls: [
      {
        platform: "twitch",
        url: "https://www.twitch.tv/necrotal_",
      },
    ],
    donationUrls: [
      {
        platform: "donation_alerts",
        url: "https://www.donationalerts.com/r/necrotal",
      },
    ],
  },
  shinmiri2: {
    name: "shinmiri2",
    streamUrls: [
      {
        platform: "twitch",
        url: "https://www.twitch.tv/shinmiri2",
      },
    ],
    donationUrls: [
      {
        platform: "streamlabs",
        url: "https://streamlabs.com/shinmiri2/tip",
      },
    ],
  },
}

const stepHandler = new Composer<Scenes.WizardContext>()
stepHandler.hears("exit", async (ctx) => {
  await ctx.reply("Returning to main menu via type")
  return ctx.scene.leave()
})
stepHandler.command("exit", async (ctx) => {
  await ctx.reply("Returning to main menu")
  return ctx.scene.leave()
})
stepHandler.hears(Object.keys(STREAMERS), async (ctx) => {
  const message = ctx.message as Message.TextMessage
  await ctx.reply(`Ok, ${STREAMERS[message.text].name} it is`)
  return ctx.scene.leave()
})
stepHandler.action(Object.keys(STREAMERS), async (ctx) => {
  const message = ctx.update.callback_query.message as Message.TextMessage
  await ctx.answerCbQuery(`${message.text} selected`)
  await ctx.reply(`Ok, ${STREAMERS[message.text].name} it is`)
  await ctx.reply(`Debug:  Via inline ${1}`)
  return ctx.scene.leave()
})
stepHandler.use((ctx) =>
  ctx.replyWithMarkdown("Select the streamer via button or type his nickname")
)

export const DONAT_WIZARD_SCENE_ID = "DONAT_WIZARD_SCENE_ID"

// const streamersKeyboard = Markup.keyboard(Object.keys(STREAMERS)).oneTime()
const streamersKeyboardInline = Markup.inlineKeyboard(
  Object.keys(STREAMERS).map((key) => Markup.button.callback(key, key))
)

export const donatWizardScene = new Scenes.WizardScene(
  DONAT_WIZARD_SCENE_ID,
  async (ctx) => {
    await ctx.reply(
      "Select streamer or type his nickname",
      streamersKeyboardInline
    )
    return ctx.wizard.next()
  },
  stepHandler
)
