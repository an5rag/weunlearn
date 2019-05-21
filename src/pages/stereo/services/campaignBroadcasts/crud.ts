import { firestore } from "firebase";
import { ICampaignBroadcast, ICampaignBroadcastWithId } from "./types";
import { getCampaignsRefByProject } from "../campaigns/crud";

export async function getCampaignBroadcasts(
  projectId: string,
  campaignId: string
): Promise<ICampaignBroadcastWithId[]> {
  const campaignBroadcastsCollectionRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  const snapshot: firestore.QuerySnapshot = await campaignBroadcastsCollectionRef.get();
  return snapshot.docs.map(mapDocumentToCampaignBroadcast);
}

export async function getCampaignBroadcast(
  projectId: string,
  campaignId: string,
  campaignBroadcastId: string
): Promise<ICampaignBroadcastWithId | undefined> {
  const campaignBroadcastsCollectionRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  const document = await campaignBroadcastsCollectionRef
    .doc(campaignBroadcastId)
    .get();
  if (document.data()) {
    return mapDocumentToCampaignBroadcast(
      document as firestore.QueryDocumentSnapshot
    );
  }
}

export function getCampaignBroadcastsSubscription(
  projectId: string,
  campaignId: string,

  fn: (campaignBroadcasts: ICampaignBroadcastWithId[]) => void
): () => void {
  const campaignBroadcastsCollectionRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  return campaignBroadcastsCollectionRef.onSnapshot(snapshot => {
    fn(snapshot.docs.map(mapDocumentToCampaignBroadcast));
  });
}

export async function addCampaignBroadcast(
  projectId: string,
  campaignId: string,
  campaignBroadcast: ICampaignBroadcast
): Promise<string> {
  const campaignBroadcastsCollectionRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  const document = await campaignBroadcastsCollectionRef.add(campaignBroadcast);
  return document.id;
}

export async function updateCampaignBroadcast(
  projectId: string,
  campaignId: string,
  id: string,
  partialCampaignBroadcast: Partial<ICampaignBroadcast>
): Promise<void> {
  const campaignBroadcastsCollectionRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  const document = await campaignBroadcastsCollectionRef.doc(id);
  await document.update(partialCampaignBroadcast);
}

export async function deleteCampaignBroadcast(
  projectId: string,
  campaignId: string,
  id: string
): Promise<void> {
  const campaignBroadcastsCollectionRef = getCampaignBroadcastsRefByCampaign(
    projectId,
    campaignId
  );
  const document = await campaignBroadcastsCollectionRef.doc(id);
  await document.delete();
}

function mapDocumentToCampaignBroadcast(
  document: firestore.QueryDocumentSnapshot
): ICampaignBroadcastWithId {
  const data = document.data();
  const campaignBroadcast: ICampaignBroadcastWithId = {
    name: data.name,
    id: document.id,
    dateStarted: data.dateStarted,
    contactListId: data.contactListId
  };
  return campaignBroadcast;
}

function getCampaignBroadcastsRefByCampaign(
  projectId: string,
  campaignId: string
) {
  const campaignRef = getCampaignsRefByProject(projectId);
  return campaignRef.doc(campaignId).collection("campaignBroadcasts");
}
