import React from "react";
import { firestore } from "firebase";
import { Dashboard, DashboardProps } from "./dashboard";
import { ICampaign, ICampaignBroadcast } from "../../types";

const collectionNames = {
  campaigns: "campaigns",
  blasts: "blasts",
  sessions: "sessions"
};

export class DashboardContainer extends React.Component<{}, DashboardProps> {
  public db: firestore.Firestore;
  constructor(props: {}) {
    super(props);
    this.db = firestore();
    this.db
      .collectionGroup("blasts")
      .get()
      .then(console.log);
  }

  componentDidMount() {
    const campaignCollection = this.db.collection(collectionNames.campaigns);
    campaignCollection.get().then(async snapshot => {
      const campaignsPromises: Promise<ICampaign>[] = snapshot.docs.map(
        async doc => {
          const data = doc.data();
          const id = doc.id;
          const campaign: ICampaign = {
            id,
            appId: data.appId,
            dateCreated: data.dateCreated,
            name: data.name,
            description: data.description,
            blasts: []
          };
          const blastsSnapshot = await campaignCollection
            .doc(id)
            .collection(collectionNames.blasts)
            .get();
          campaign.blasts = blastsSnapshot.docs.map(blastDoc => {
            const blastData = blastDoc.data();
            return {
              id: blastDoc.id,
              dateStarted: (blastData.dateStarted as firestore.Timestamp).toDate(),
              name: blastData.name,
              sessions: []
            } as ICampaignBroadcast;
          });

          return campaign;
        }
      );

      const campaigns: ICampaign[] = [];
      campaignsPromises.forEach(campaignPromise =>
        campaignPromise.then(campaign => campaigns.push(campaign))
      );
      await Promise.all(campaignsPromises);

      this.setState({ campaigns });
    });
  }

  render() {
    // const campaignCollection = this.db.collection(collectionNames.campaigns);

    // mockCampaigns.forEach(campaign => {
    //   campaignCollection
    //     .add({
    //       dateCreated: campaign.dateCreated,
    //       name: campaign.name,
    //       description: campaign.description,
    //       appId: campaign.appId
    //     })
    //     .then(campaignDoc => {
    //       mockBlasts.forEach(blast => {
    //         campaignDoc.collection(collectionNames.blasts).add({
    //           name: blast.name,
    //           dateStarted: blast.dateStarted
    //         });
    //       });
    //     });
    // });
    return <Dashboard {...this.state} />;
  }
}
