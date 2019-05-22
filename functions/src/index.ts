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
import console = require("console");
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
      return makeCall(phoneNumber, exotelLine, appId).then(
        result => {
          session = {
            dateCreated: new Date(),
            phoneNumber,
            response: JSON.stringify(result.data),
            success: true
          };
          sessionsRef.add(session);
        },
        e => {
          session = {
            dateCreated: new Date(),
            phoneNumber,
            response: e.response ? e.response.data : "Unknown Error",
            success: false
          };
          sessionsRef.add(session);
        }
      );
    });

    await Promise.all(promises);

    return {
      broadcastId: data.broadcastId
    };
  }
);
