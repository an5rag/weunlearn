import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { makeCall } from "./exotel/calls";
import {
  ICampaignBroadcast,
  IContactGroup,
  IContact,
  ICampaign,
  ISession
} from "./firestoreDatabaseTypes";
import { parseString } from "xml2js";
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export const makeExotelCallHttps = functions.https.onRequest(
  async (request, response) => {
    return makeCall("080-468-10634", "080-468-09273", "211081").then(
      result => {
        response.send(result.data);
      },
      e => {
        response.send(e.response.data);
      }
    );
  }
);

export const makeExotelCall = functions.https.onCall(async () => {
  return makeCall("080-468-10634", "080-468-09273", "211081").then(
    result => {
      return result.data;
    },
    e => {
      return e;
    }
  );
});

export const updateSessionResponse = functions.https.onRequest(
  async (request, response) => {
    // find session id
    const sessionId = request.query.sessionId;
    console.log(request.query.sessionId);
    if (sessionId) {
      // find session
      const sessionResult = await db
        .collectionGroup("sessions")
        .where("id", "==", sessionId)
        .get();
      if (sessionResult.docs.length !== 1) {
        throw new functions.https.HttpsError(
          "internal",
          `Unique session couldn't be found! Length: ${
            sessionResult.docs.length
          }`
        );
      } else {
        const session = sessionResult.docs[0].data();
        response.send(session);
      }
    } else {
      throw new functions.https.HttpsError(
        "internal",
        `No session id provided.`
      );
    }
    response.send(request.query);
  }
);

export const executeBroadcast = functions.https.onCall(
  async (data: {
    broadcastId: string;
    projectId: string;
    campaignId: string;
  }) => {
    if (!data.projectId) {
      throw new functions.https.HttpsError(
        "internal",
        `No project id provided.`
      );
    }

    if (!data.campaignId) {
      throw new functions.https.HttpsError(
        "internal",
        `No campaign id provided.`
      );
    }

    if (!data.broadcastId) {
      throw new functions.https.HttpsError(
        "internal",
        `No broadcast id provided.`
      );
    }

    const projectDocRef = await db.collection("projects").doc(data.projectId);

    const campaignDocRef = await projectDocRef
      .collection("campaigns")
      .doc(data.campaignId);
    const campaignDoc = await campaignDocRef.get();
    if (!campaignDoc.exists) {
      throw new functions.https.HttpsError(
        "internal",
        `Cannot find campaign for id: ${data.campaignId} in project: ${
          data.projectId
        }`
      );
    }
    const { appId, phoneNumber: exotelLine } = campaignDoc.data() as ICampaign;

    const broadcastDocRef = await campaignDocRef
      .collection("campaignBroadcasts")
      .doc(data.broadcastId);
    const broadcastDoc = await broadcastDocRef.get();
    if (!broadcastDoc.exists) {
      throw new functions.https.HttpsError(
        "internal",
        `Cannot find broadcast for id: ${data.broadcastId}`
      );
    }
    const broadcast = broadcastDoc.data() as ICampaignBroadcast;
    const { contactGroupId } = broadcast;
    const sessionsRef = broadcastDocRef.collection("sessions");

    const contactGroupDocRef = await db
      .collection("contactgroups")
      .doc(contactGroupId);
    const contactGroupDoc = await contactGroupDocRef.get();
    if (!contactGroupDoc.exists) {
      throw new functions.https.HttpsError(
        "internal",
        `Cannot find contactGroup for id: ${contactGroupId}`
      );
    }

    const contactsDocs = (await db
      .collection("contacts")
      .where("groupIds", "array-contains", contactGroupId)
      .get()).docs;
    if (!contactsDocs.length) {
      throw new functions.https.HttpsError(
        "internal",
        `No contacts are associated with this group: ${
          (contactGroupDoc.data() as IContactGroup).name
        }`
      );
    }
    const phoneNumbers: string[] = contactsDocs.map(doc => {
      const contact = doc.data() as IContact;
      return contact.phone;
    });

    const promises = phoneNumbers.map(async phoneNumber => {
      let session: ISession;
      const documentRef = await sessionsRef.add({});
      const callbackUrl = `https://us-central1-weunlearn-ivr-automation-45d58.cloudfunctions.net/updateSessionResponse/?sessionId=${
        documentRef.id
      }`;
      return makeCall(phoneNumber, exotelLine, appId, callbackUrl).then(
        result => {
          return new Promise((resolve, reject) => {
            parseString(result.data, async (err, parsedResult) => {
              session = {
                dateCreated: new Date(),
                phoneNumber,
                response: parsedResult,
                success: true
              };
              await documentRef.update(session);
              resolve();
            });
          });
        },
        e => {
          return new Promise((resolve, reject) => {
            parseString(
              e.response ? e.response.data : "<Error>Unknown Error</Error>",
              async (err, parsedResult) => {
                session = {
                  dateCreated: new Date(),
                  phoneNumber,
                  response: parsedResult,
                  success: false
                };
                await documentRef.update(session);
                resolve();
              }
            );
          });
        }
      );
    });

    await Promise.all(promises);

    return {
      broadcastId: data.broadcastId
    };
  }
);
