import { ICampaign, ICampaignBlast, Status } from "./data.types";

export const mockCampaigns: ICampaign[] = [
  {
    id: "c-1",
    dateCreated: new Date(Date.UTC(2019, 5, 7, 2, 20, 12)),
    name: "Episode 1",
    description: "First episode in Stereo",
    blastIds: []
  }
];

export const mockBlasts: ICampaignBlast[] = [
  {
    id: "b-1",
    dateStarted: new Date(Date.UTC(2019, 4, 7, 4, 20, 12)),
    campaignId: "c-1",
    sessions: [
      {
        userName: "Anurag",
        id: "s-1",
        phoneNumber: "+919339898123",
        status: Status.Completed,
        duration: 12,
        lastCheckpoint: "End"
      }
    ]
  },
  {
    id: "b-2",
    dateStarted: new Date(),
    campaignId: "c-1",
    sessions: [
      {
        id: "s-1",
        userName: "Meghna",
        phoneNumber: "+919339898123",
        status: Status.Completed,
        duration: 12,
        lastCheckpoint: "End"
      },
      {
        id: "s-2",
        userName: "Garima",
        phoneNumber: "+919339898123",
        status: Status.Failed,
        duration: 2,
        lastCheckpoint: "NotStarted"
      }
    ]
  }
];
