import React from "react";
import { Text, AccordionPanel, DataTable, Button } from "grommet";
import { ICampaignBroadcastWithId } from "../../../services/campaignBroadcasts/types";
import { getSessionsSubscription } from "../../../services/sessions/crud";
import { ISession } from "../../../services/sessions/types";
import moment from "moment";
import { Refresh } from "grommet-icons";
import { broadcast } from "../../../services/campaignBroadcasts/crud";
import { IContactGroup } from "../../../services/contactGroups/types";
import { getContacts } from "../../../services/contacts/crud";
import { getContactGroup } from "../../../services/contactGroups/crud";

export interface CampaignBroadcastProps {
  projectId: string;
  campaignId: string;
  broadcast: ICampaignBroadcastWithId;
  broadcasting: boolean;
}

interface CampaignBroadcastState {
  sessions?: ISession[];
  redeploying?: boolean;
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
            {this.props.broadcasting || this.state.redeploying
              ? " (Currently broadcasting ...)"
              : ""}
            <Button
              onClick={async () => {
                if (this.props.broadcasting) {
                  return;
                }
                this.setState({
                  redeploying: true
                });
                await broadcast(
                  this.props.projectId,
                  this.props.campaignId,
                  this.props.broadcast.id
                );
                this.setState({
                  redeploying: false
                });
              }}
              icon={<Refresh />}
              label="Redeploy"
            />
          </Text>
        }
        key={this.props.broadcast.id}
      >
        <Text>
          <b>Broadcasted on: </b>
          {moment(this.props.broadcast.dateBroadcasted).format(
            "MMMM Do h:mm a"
          )}{" "}
          ({moment(this.props.broadcast.dateBroadcasted).fromNow()})
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
                render: (datum: ISession) => (datum.success ? "True" : "False")
              },
              {
                property: "response",
                header: "Response",
                primary: true,
                render: (datum: ISession) => datum.response
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
      </AccordionPanel>
    );
  }
}

// function get2D(num: number): string {
//   if (num.toString().length < 2)
//     // Integer of less than two digits
//     return "0" + num; // Prepend a zero!
//   return num.toString(); // return string for consistency
// }
