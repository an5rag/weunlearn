import { firestore } from "firebase";
import { ICampaign, ICampaignWithId } from "./types";
import { getProjectsRef } from "../projects/crud";

export async function getCampaigns(
  projectId: string
): Promise<ICampaignWithId[]> {
  const campaignsCollectionRef = getCampaignsRefByProject(projectId);
  const snapshot: firestore.QuerySnapshot = await campaignsCollectionRef.get();
  return snapshot.docs.map(mapDocumentToCampaign);
}

export async function getCampaign(
  projectId: string,
  campaignId: string
): Promise<ICampaignWithId | undefined> {
  const campaignsCollectionRef = getCampaignsRefByProject(projectId);
  const document = await campaignsCollectionRef.doc(campaignId).get();
  if (document.data()) {
    return mapDocumentToCampaign(document as firestore.QueryDocumentSnapshot);
  }
}

export function getCampaignsSubscription(
  projectId: string,

  fn: (campaigns: ICampaignWithId[]) => void
): () => void {
  const campaignsCollectionRef = getCampaignsRefByProject(projectId);
  return campaignsCollectionRef.onSnapshot(snapshot => {
    fn(snapshot.docs.map(mapDocumentToCampaign));
  });
}

export async function addCampaign(
  projectId: string,
  campaign: ICampaign
): Promise<string> {
  const campaignsCollectionRef = getCampaignsRefByProject(projectId);
  const document = await campaignsCollectionRef.add(campaign);
  return document.id;
}

export async function updateCampaign(
  projectId: string,
  id: string,
  partialCampaign: Partial<ICampaign>
): Promise<void> {
  const campaignsCollectionRef = getCampaignsRefByProject(projectId);
  const document = await campaignsCollectionRef.doc(id);
  await document.update(partialCampaign);
}

export async function deleteCampaign(
  projectId: string,
  id: string
): Promise<void> {
  const campaignsCollectionRef = getCampaignsRefByProject(projectId);
  const document = await campaignsCollectionRef.doc(id);
  await document.delete();
}

function mapDocumentToCampaign(
  document: firestore.QueryDocumentSnapshot
): ICampaignWithId {
  const data = document.data();
  const campaign: ICampaignWithId = {
    name: data.name,
    id: document.id,
    dateCreated: (data.dateCreated as firestore.Timestamp).toDate(),
    description: data.description,
    appId: data.appId,
    phoneNumber: data.phoneNumber
  };
  return campaign;
}

export function getCampaignsRefByProject(projectId: string) {
  const projectRef = getProjectsRef();
  return projectRef.doc(projectId).collection("campaigns");
}
