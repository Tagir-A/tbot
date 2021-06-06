import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

export const donatAd = functions.https.onRequest(async (request, response) => {
  const auth = request.get("Authorization")
  if (auth === undefined || !auth.startsWith("Bearer")) {
    return response.status(401).end()
  }

  const tokenId = auth.split("Bearer ")[1]
  admin
    .auth()
    .verifyIdToken(tokenId)
    .then((decoded) => response.status(200).send(decoded))
    .catch((err) => response.status(401).send(err))
  return
})
