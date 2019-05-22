import React from "react";
import { Text, AccordionPanel, DataTable, Button, Box } from "grommet";
import { ICampaignBroadcastWithId } from "../../../services/campaignBroadcasts/types";
import { getSessionsSubscription } from "../../../services/sessions/crud";
import { ISession } from "../../../services/sessions/types";
import moment from "moment";
import { Refresh } from "grommet-icons";
import {
  broadcast,
  updateCampaignBroadcast
} from "../../../services/campaignBroadcasts/crud";
import { IContactGroup } from "../../../services/contactGroups/types";
import { getContacts } from "../../../services/contacts/crud";
import { getContactGroup } from "../../../services/contactGroups/crud";

export interface CampaignBroadcastProps {
  projectId: string;
  campaignId: string;
  broadcast: ICampaignBroadcastWithId;
}

interface CampaignBroadcastState {
  sessions?: ISession[];
  deploying?: boolean;
  contactGroup?: IContactGroup;
  contacts: { [phone: string]: string };
}

export class CampaignBroadcast extends React.Component<
  CampaignBroadcastProps,
  CampaignBroadcastState
> {
  private sessions: () => void;
  constructor(props: CampaignBroadcastProps) {
    super(props);
    this.sessions = () => {};
    this.state = {
      contacts: {}
    };
  }

  componentDidMount() {
    this.sessions = getSessionsSubscription(
      this.props.projectId,
      this.props.campaignId,
      this.props.broadcast.id,
      sessions => {
        this.setState({ sessions });
      }
    );
    getContacts(this.props.broadcast.contactGroupId).then(contacts => {
      const contactsMap: { [phone: string]: string } = {};
      for (const contact of contacts) {
        contactsMap[contact.phone] = contact.name;
      }
      this.setState({
        contacts: contactsMap
      });
    });
    getContactGroup(this.props.broadcast.contactGroupId).then(contactGroup => {
      this.setState({
        contactGroup
      });
    });
  }

  componentWillUnmount() {
    this.sessions();
  }

  render() {
    return (
      <AccordionPanel
        label={
          <Text color="neutral-3" size="medium" margin={{ vertical: "small" }}>
            {this.props.broadcast.name}
            {this.state.deploying ? " (Currently broadcasting ...)" : ""}
          </Text>
        }
        key={this.props.broadcast.id}
      >
        <Box gap="medium" align="start">
          <Button
            onClick={async () => {
              this.setState({
                deploying: true
              });
              await broadcast(
                this.props.projectId,
                this.props.campaignId,
                this.props.broadcast.id
              );
              updateCampaignBroadcast(
                this.props.projectId,
                this.props.campaignId,
                this.props.broadcast.id,
                {
                  dateBroadcasted: new Date()
                }
              );
              this.setState({
                deploying: false
              });
            }}
            icon={<Refresh />}
            disabled={this.state.deploying}
            label={
              this.state.deploying
                ? "Deploying"
                : this.props.broadcast.dateBroadcasted
                ? "Redeploy"
                : "Deploy"
            }
          />
          <Text>
            <b>Created on: </b>
            {this.props.broadcast.dateCreated
              ? getPrettyDate(this.props.broadcast.dateCreated)
              : ""}
          </Text>
          <Text>
            <b>Broadcasted on: </b>
            {this.props.broadcast.dateBroadcasted
              ? getPrettyDate(this.props.broadcast.dateBroadcasted)
              : ""}
          </Text>

          <Text>
            <b>Broadcasted to: </b>
            {this.state.contactGroup ? this.state.contactGroup.name : "Loading"}
          </Text>

          {this.state.sessions ? (
            <DataTable
              margin="medium"
              columns={[
                {
                  property: "number",
                  header: <Text>Name</Text>,
                  primary: false,
                  render: (datum: ISession) =>
                    this.state.contacts[datum.phoneNumber]
                },

                {
                  property: "phoneNumber",
                  header: "Phone Number",
                  render: (datum: ISession) => datum.phoneNumber
                },
                {
                  property: "success",
                  header: "Success",
                  primary: true,
                  render: (datum: ISession) =>
                    datum.success ? "True" : "False"
                },
                {
                  property: "response",
                  header: "Response",
                  primary: true,
                  render: (datum: ISession) => JSON.stringify(datum.response)
                }

                // {
                //   property: "duration",
                //   header: "Duration",
                //   render: (datum: ISession) =>
                //     datum.duration
                //       ? `${Math.floor(datum.duration / 60)}:${get2D(
                //           datum.duration % 60
                //         )}`
                //       : "Unknown"
                // }
              ]}
              data={this.state.sessions}
            />
          ) : (
            <>No sessions yet.</>
          )}
        </Box>
      </AccordionPanel>
    );
  }
}

function getPrettyDate(date: Date): string {
  return `
  ${moment(date).format("MMMM Do h:mm a")} (${moment(date).fromNow()})`;
}

// function get2D(num: number): string {
//   if (num.toString().length < 2)
//     // Integer of less than two digits
//     return "0" + num; // Prepend a zero!
//   return num.toString(); // return string for consistency
// }
