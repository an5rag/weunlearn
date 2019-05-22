import React from "react";
import { Box, Text, Accordion, AccordionPanel, Heading, Button } from "grommet";
import { Add } from "grommet-icons";
import { ICampaignWithId } from "../../../services/campaigns/types";
import {
  getCampaignBroadcastsSubscription,
  addCampaignBroadcast
} from "../../../services/campaignBroadcasts/crud";
import {
  ICampaignBroadcastWithId,
  ICampaignBroadcast
} from "../../../services/campaignBroadcasts/types";
import {
  ConfigurerState,
  DocumentConfigurer,
  DocumentConfigurerProps,
  PropertyType,
  SelectOption
} from "../../../elements/documentConfigurer";
import { CampaignBroadcast } from "./campaignBroadcast";
import { LoadingImage } from "../../../../../elements/loadingImage";
import { IContactGroupWithID } from "../../../services/contactGroups/types";
import { getContactGroups } from "../../../services/contactGroups/crud";

export interface CampaignProps {
  projectId: string;
  campaign: ICampaignWithId;
}

interface CampaignState {
  campaignBroadcasts?: ICampaignBroadcastWithId[];
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
  contactGroups?: IContactGroupWithID[];
}

export class Campaign extends React.Component<CampaignProps, CampaignState> {
  private campaignBroadcastsSubscription: () => void;
  constructor(props: CampaignProps) {
    super(props);
    this.campaignBroadcastsSubscription = () => {};
    this.state = {
      configurerState: ConfigurerState.Add,
      isConfigurerOpen: false
    };
  }

  componentDidMount() {
    this.campaignBroadcastsSubscription = getCampaignBroadcastsSubscription(
      this.props.projectId,
      this.props.campaign.id,
      campaignBroadcasts => {
        this.setState({ campaignBroadcasts });
      }
    );
    getContactGroups().then(contactGroups => {
      this.setState({
        contactGroups
      });
    });
  }

  componentWillUnmount() {
    this.campaignBroadcastsSubscription();
  }

  render() {
    return (
      <>
        {this.renderCampaignBroadcastConfigurer()}
        <AccordionPanel
          key={this.props.campaign.id}
          label={
            <Heading color="neutral-4" level="3" margin={"none"}>
              {this.props.campaign.name}
            </Heading>
          }
        >
          <Box
            margin={{ left: "medium", top: "medium" }}
            align="start"
            gap="medium"
          >
            <Text>
              <b>Description: </b>
              {this.props.campaign.description}
            </Text>
            <Text>
              <b>App ID: </b>
              {this.props.campaign.appId}
            </Text>
            <Text>
              <b>Caller ID: </b>
              {this.props.campaign.phoneNumber}
            </Text>
            <Button
              icon={<Add />}
              label="New Broadcast"
              onClick={() => {
                this.setState({
                  configurerState: ConfigurerState.Add,
                  isConfigurerOpen: true
                });
              }}
              primary
            />
            <Accordion multiple>
              {this.state.campaignBroadcasts ? (
                this.state.campaignBroadcasts.map(campaignBroadcast => {
                  return (
                    <CampaignBroadcast
                      key={campaignBroadcast.id}
                      projectId={this.props.projectId}
                      campaignId={this.props.campaign.id}
                      broadcast={campaignBroadcast}
                    />
                  );
                })
              ) : (
                <LoadingImage />
              )}
            </Accordion>
          </Box>
        </AccordionPanel>
      </>
    );
  }

  private renderCampaignBroadcastConfigurer(): JSX.Element {
    const documentConfigurerProps: DocumentConfigurerProps<
      ICampaignBroadcast
    > = {
      configurerState: this.state.configurerState,
      isOpen: this.state.isConfigurerOpen,
      onDismiss: () => this.setState({ isConfigurerOpen: false }),
      documentTypeName: "Broadcast",
      onAdd: async document => {
        document.dateCreated = new Date();
        await addCampaignBroadcast(
          this.props.projectId,
          this.props.campaign.id,
          document
        );
        this.setState({ isConfigurerOpen: false });
      },
      onUpdate: async document => {
        this.setState({ isConfigurerOpen: false });
      },
      onDelete: async () => {
        this.setState({ isConfigurerOpen: false });
      },
      properties: [
        {
          key: "name",
          type: PropertyType.String,
          getValue: document => document.name,
          label: "Name",
          onChange: (value, document) => ({
            ...document,
            name: value
          }),
          placeholder: "Enter a name for the broadcast"
        },
        {
          key: "contactGroupId",
          type: PropertyType.Select,
          getValue: document => document.contactGroupId,
          label: "Contact Group",
          onChange: (value: SelectOption, document) => ({
            ...document,
            contactGroupId: value.key
          }),
          options: this.state.contactGroups
            ? this.state.contactGroups.map(contactGroup => {
                return {
                  key: contactGroup.id,
                  label: contactGroup.name
                };
              })
            : [],
          placeholder: "Contact Group to broadcast to"
        }
      ]
    };
    return (
      <DocumentConfigurer
        key={this.state.configurerState}
        {...documentConfigurerProps}
      />
    );
  }
}
