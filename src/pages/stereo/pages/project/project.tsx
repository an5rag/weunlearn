import React, { CSSProperties } from "react";
import { Box, Accordion, Button, Heading, Text } from "grommet";
import { Add, Edit, Trash } from "grommet-icons";
import { LoadingImage } from "../../../../elements/loadingImage";
import { IProjectWithId } from "../../services/projects/types";
import { Campaign } from "./elements/campaign";
import { ICampaignWithId, ICampaign } from "../../services/campaigns/types";
import {
  DocumentConfigurerProps,
  PropertyType,
  DocumentConfigurer,
  ConfigurerState
} from "../../elements/documentConfigurer";
import {
  addCampaign,
  updateCampaign,
  deleteCampaign
} from "../../services/campaigns/crud";

export interface ProjectProps {
  project?: IProjectWithId;
  campaigns?: ICampaignWithId[];
}

export interface ProjectState {
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
  campaignIdToEdit: string;
}

export class Project extends React.Component<ProjectProps, ProjectState> {
  public state: ProjectState = {
    configurerState: ConfigurerState.Add,
    isConfigurerOpen: false,
    campaignIdToEdit: ""
  };
  render() {
    return (
      <Box id="project" width="xlarge" direction="column" align="start">
        {this.props.project ? (
          this.renderProject(this.props.project)
        ) : (
          <Box width="100%" align="center">
            <LoadingImage />
          </Box>
        )}
      </Box>
    );
  }

  private renderProject(project: IProjectWithId) {
    return (
      <>
        {this.renderCampaignConfigurer(project)}
        <Box
          gap="medium"
          align="start"
          animation={{ type: "fadeIn", duration: 300 }}
        >
          <Heading margin="0" level="2">
            {project.name}
          </Heading>
          <Text margin="0">{project.description}</Text>
          <Button
            icon={<Add />}
            label="New Campaign"
            onClick={() => {
              this.setState({
                configurerState: ConfigurerState.Add,
                isConfigurerOpen: true
              });
            }}
            primary
          />
          {this.props.campaigns ? (
            this.renderCampaigns(project.id, this.props.campaigns)
          ) : (
            <></>
          )}
        </Box>
      </>
    );
  }

  private renderCampaigns(projectId: string, campaigns: ICampaignWithId[]) {
    const buttonStyles: CSSProperties = {
      padding: 5,
      marginRight: "5px"
    };
    return (
      <Box animation={{ type: "slideDown", duration: 200 }}>
        <Accordion multiple>
          {campaigns.map(campaign => (
            <Box
              key={campaign.id}
              direction="row"
              align="start"
              margin={{ vertical: "medium" }}
            >
              <Button
                style={buttonStyles}
                icon={<Edit />}
                onClick={() => {
                  this.setState({
                    configurerState: ConfigurerState.Edit,
                    isConfigurerOpen: true,
                    campaignIdToEdit: campaign.id
                  });
                }}
              />
              <Button
                style={buttonStyles}
                icon={<Trash />}
                onClick={() => {
                  this.setState({
                    configurerState: ConfigurerState.Delete,
                    isConfigurerOpen: true,
                    campaignIdToEdit: campaign.id
                  });
                }}
              />
              <Campaign projectId={projectId} campaign={campaign} />
            </Box>
          ))}
        </Accordion>
      </Box>
    );
  }

  private renderCampaignConfigurer(project: IProjectWithId): JSX.Element {
    const documentConfigurerProps: DocumentConfigurerProps<ICampaign> = {
      configurerState: this.state.configurerState,
      isOpen: this.state.isConfigurerOpen,
      onDismiss: () => this.setState({ isConfigurerOpen: false }),
      document:
        this.state.configurerState === ConfigurerState.Edit &&
        this.props.campaigns
          ? this.props.campaigns.find(
              campaign => campaign.id === this.state.campaignIdToEdit
            )
          : undefined,
      documentTypeName: "Campaign",
      onAdd: async document => {
        document.dateCreated = new Date();
        await addCampaign(project.id, document);
        this.setState({ isConfigurerOpen: false });
      },
      onUpdate: async document => {
        await updateCampaign(project.id, this.state.campaignIdToEdit, document);
        this.setState({ isConfigurerOpen: false });
      },
      onDelete: async () => {
        await deleteCampaign(project.id, this.state.campaignIdToEdit);

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
          placeholder: "Enter name of the campaign"
        },
        {
          key: "description",
          type: PropertyType.String,
          getValue: document => document.description,
          label: "Description",
          onChange: (value, document) => ({
            ...document,
            description: value
          }),
          placeholder: "Describe the campaign's scope"
        },
        {
          key: "appId",
          type: PropertyType.String,
          getValue: document => document.appId,
          label: "AppId",
          onChange: (value, document) => ({
            ...document,
            appId: value
          }),
          placeholder: "Exotel App Id"
        },
        {
          key: "phone",
          type: PropertyType.String,
          getValue: document => document.phoneNumber,
          label: "Phone number",
          onChange: (value, document) => ({
            ...document,
            phoneNumber: value
          }),
          placeholder: "Phone number to use"
        }
      ]
    };
    return (
      <DocumentConfigurer
        key={this.state.configurerState + "" + this.state.campaignIdToEdit}
        {...documentConfigurerProps}
      />
    );
  }
}
