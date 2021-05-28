import { Composer, Markup, Scenes } from "telegraf"

const stepHandler = new Composer<Scenes.WizardContext>()
stepHandler.action("next", async (ctx) => {
  await ctx.reply("Step 2. Via inline button")
  return ctx.wizard.next()
})
stepHandler.command("next", async (ctx) => {
  await ctx.reply("Step 2. Via command")
  return ctx.wizard.next()
})
stepHandler.hears("exit", async (ctx) => {
  await ctx.reply("Returning to main menu via type")
  return ctx.scene.leave()
})
stepHandler.command("exit", async (ctx) => {
  await ctx.reply("Returning to main menu")
  return ctx.scene.leave()
})
stepHandler.use((ctx) =>
  ctx.replyWithMarkdown("Press `Next` button or type /next")
)

export const superWizard = new Scenes.WizardScene(
  "super-wizard",
  async (ctx) => {
    await ctx.reply(
      "Step 1",
      Markup.inlineKeyboard([
        Markup.button.url("❤️", "http://telegraf.js.org"),
        Markup.button.callback("➡️ Next", "next"),
      ])
    )
    return ctx.wizard.next()
  },
  stepHandler,
  async (ctx) => {
    await ctx.reply("Step 3")
    return ctx.wizard.next()
  },
  async (ctx) => {
    await ctx.reply("Step 4")
    return ctx.wizard.next()
  },
  async (ctx) => {
    await ctx.reply("Done")
    return await ctx.scene.leave()
  }
)
