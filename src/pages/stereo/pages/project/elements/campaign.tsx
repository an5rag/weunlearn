import React from "react";
import { Box, Text, Accordion, AccordionPanel, Heading, Button } from "grommet";
import { Add } from "grommet-icons";
import { ICampaignWithId } from "../../../services/campaigns/types";

export interface CampaignProps {
  campaign: ICampaignWithId;
}

export class Campaign extends React.Component<CampaignProps> {
  render() {
    return (
      <AccordionPanel
        key={this.props.campaign.id}
        label={
          <Heading color="neutral-4" level="3">
            {this.props.campaign.name}
          </Heading>
        }
      >
        <Box margin={{ left: "medium" }} align="start" gap="medium">
          <Text>
            <b>Description: </b>
            {this.props.campaign.description}
          </Text>
          <Text>
            <b>App ID: </b>
            {this.props.campaign.appId}
          </Text>
          <Button
            icon={<Add />}
            label="New Broadcast"
            onClick={() => {}}
            primary
          />
          <Accordion multiple />
        </Box>
      </AccordionPanel>
    );
  }

  // private renderBroadcast(broadcast: ICampaignBroadcastWithId) {
  //   return (
  //     <AccordionPanel
  //       label={
  //         <Text color="neutral-3" size="medium" margin={{ vertical: "small" }}>
  //           {broadcast.name}
  //         </Text>
  //       }
  //       key={broadcast.id}
  //     >
  //       <Text>
  //         <b>Made on: </b>
  //         {moment(broadcast.dateStarted).format("MMMM Do h:mm a")} (
  //         {moment(broadcast.dateStarted).fromNow()})
  //       </Text>
  //       <DataTable
  //         margin="medium"
  //         columns={[
  //           {
  //             property: "name",
  //             header: <Text>Name</Text>,
  //             primary: false,
  //             render: (datum: ISession) => datum.contactId
  //           },
  //           {
  //             property: "phoneNumber",
  //             header: "Phone Number",
  //             primary: true,
  //             render: (datum: ISession) => datum.phoneNumber
  //           },
  //           {
  //             property: "duration",
  //             header: "Duration",
  //             render: (datum: ISession) =>
  //               datum.duration
  //                 ? `${Math.floor(datum.duration / 60)}:${get2D(
  //                     datum.duration % 60
  //                   )}`
  //                 : "Unknown"
  //           }
  //         ]}
  //         data={broadcast.sessions}
  //       />
  //     </AccordionPanel>
  //   );
  // }
}

// function get2D(num: number): string {
//   if (num.toString().length < 2)
//     // Integer of less than two digits
//     return "0" + num; // Prepend a zero!
//   return num.toString(); // return string for consistency
// }
