import { ICampaign, ICampaignBroadcast, Status } from "./types";

export const mockBlasts: ICampaignBroadcast[] = [
  {
    id: "b-1",
    name: "sample blast 1",
    dateStarted: new Date(Date.UTC(2019, 4, 7, 4, 20, 12)),
    sessions: [
      {
        contactId: "Anurag",
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
    name: "sample blast 2",
    dateStarted: new Date(),
    sessions: [
      {
        id: "s-1",
        contactId: "Meghna",
        phoneNumber: "+919339898123",
        status: Status.Completed,
        duration: 12,
        lastCheckpoint: "End"
      },
      {
        id: "s-2",
        contactId: "Garima",
        phoneNumber: "+919339898123",
        status: Status.Failed,
        duration: 2,
        lastCheckpoint: "NotStarted"
      }
    ]
  }
];

export const mockCampaigns: ICampaign[] = [
  {
    id: "c-1",
    dateCreated: new Date(Date.UTC(2019, 5, 7, 2, 20, 12)),
    name: "Episode 1",
    description: "First episode in Stereo",
    appId: "1234",
    blasts: [mockBlasts[0], mockBlasts[1]]
  },
  {
    id: "c-2",
    dateCreated: new Date(Date.UTC(2019, 5, 7, 2, 20, 12)),
    name: "Episode 2",
    description: "Second episode in Stereo",
    blasts: [mockBlasts[0], mockBlasts[1]],
    appId: "3456"
  }
];
