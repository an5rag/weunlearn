import { firestore } from "firebase";
import { ISession, ISessionWithId } from "./types";
import { getCampaignBroadcastsRefByCampaign } from "../campaignBroadcasts/crud";

export async function getSessions(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string
): Promise<ISessionWithId[]> {
  const sessionsCollectionRef = getSessionsRefByCampaign(
    projectId,
    campaignId,
    campaignBroadcastId
  );
  const snapshot: firestore.QuerySnapshot = await sessionsCollectionRef.get();
  return snapshot.docs.map(mapDocumentToSession);
}

export async function getSession(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string,
  sessionId: string
): Promise<ISessionWithId | undefined> {
  const sessionsCollectionRef = getSessionsRefByCampaign(
    projectId,
    campaignId,
    campaignBroadcastId
  );
  const document = await sessionsCollectionRef.doc(sessionId).get();
  if (document.data()) {
    return mapDocumentToSession(document as firestore.QueryDocumentSnapshot);
  }
}

export function getSessionsSubscription(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string,
  fn: (sessions: ISessionWithId[]) => void
): () => void {
  const sessionsCollectionRef = getSessionsRefByCampaign(
    projectId,
    campaignId,
    campaignBroadcastId
  );
  return sessionsCollectionRef.onSnapshot(snapshot => {
    fn(snapshot.docs.map(mapDocumentToSession));
  });
}

export async function addSession(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string,
  session: ISession
): Promise<string> {
  const sessionsCollectionRef = getSessionsRefByCampaign(
    projectId,
    campaignId,
    campaignBroadcastId
  );
  const document = await sessionsCollectionRef.add(session);
  return document.id;
}

export async function updateSession(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string,
  id: string,
  partialSession: Partial<ISession>
): Promise<void> {
  const sessionsCollectionRef = getSessionsRefByCampaign(
    projectId,
    campaignId,
    campaignBroadcastId
  );
  const document = await sessionsCollectionRef.doc(id);
  await document.update(partialSession);
}

export async function deleteSession(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string,
  id: string
): Promise<void> {
  const sessionsCollectionRef = getSessionsRefByCampaign(
    projectId,
    campaignId,
    campaignBroadcastId
  );
  const document = await sessionsCollectionRef.doc(id);
  await document.delete();
}

function mapDocumentToSession(
  document: firestore.QueryDocumentSnapshot
): ISessionWithId {
  const data = document.data();
  const session: ISessionWithId = {
    id: document.id,
    success: data.success,
    response: data.response,
    phoneNumber: data.phoneNumber,
    dateCreated: (data.dateCreated as firestore.Timestamp).toDate()
  };
  return session;
}

function getSessionsRefByCampaign(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string
) {
  const campaignBroadcastsRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  return campaignBroadcastsRef.doc(campaignBroadcastId).collection("sessions");
}
