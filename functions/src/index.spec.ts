import ftt from "firebase-functions-test"
import * as func from "firebase-functions"

func.logger.warn = jest.fn()

const ft = ftt({ projectId: "TEST" })
ft.mockConfig({
  tg: { token: "123weqwe" },
})

import * as functions from "./index"

describe("hello", () => {
  test("function should fail without auth", async () => {
    const req: any = { query: { text: "input" } } // until I figure out how to mock a function proper
    const res: any = {
      status: jest.fn(() => ({
        send: jest.fn((props) => {
          expect(props).toMatchObject({ message: "You lack auth" })
        }),
      })),
    } // until I figure out how to mock a function proper
    await functions.hello(req, res)
    expect(func.logger.warn).toHaveBeenCalledWith("No auth", {
      structuredData: true,
    })
  })
})
