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
stepHandler.action("next", async (ctx) => {
  await ctx.reply("Step 2. Via inline button")
  return ctx.wizard.next()
})
stepHandler.command("next", async (ctx) => {
  await ctx.reply("Step 2. Via command")
  return ctx.wizard.next()
})
stepHandler.use((ctx) =>
  ctx.replyWithMarkdown("Press `Next` button or type /next")
)

export const DONAT_WIZARD_SCENE_ID = "DONAT_WIZARD_SCENE_ID"

const streamersKeyboard = Markup.keyboard(Object.keys(STREAMERS)).oneTime(true)

export const donatWizardScene = new Scenes.WizardScene(
  DONAT_WIZARD_SCENE_ID,
  async (ctx) => {
    await ctx.reply("Select streamer", streamersKeyboard)
    return ctx.wizard.next()
  },
  stepHandler,
  async (ctx) => {
    const message = ctx.message as Message.TextMessage
    await ctx.reply(`Ok ${STREAMERS[message.text]} it is}`)
    return ctx.scene.leave()
  }
)
