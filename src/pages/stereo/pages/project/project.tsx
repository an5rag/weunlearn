import React from "react";
import { Box, Accordion, Button, Heading, Text } from "grommet";
import { Add } from "grommet-icons";
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
import { addCampaign } from "../../services/campaigns/crud";

export interface ProjectProps {
  project?: IProjectWithId;
  campaigns?: ICampaignWithId[];
}

export interface ProjectState {
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
}

export class Project extends React.Component<ProjectProps, ProjectState> {
  public state: ProjectState = {
    configurerState: ConfigurerState.Add,
    isConfigurerOpen: false
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
            this.renderCampaigns(this.props.campaigns)
          ) : (
            <></>
          )}
        </Box>
      </>
    );
  }

  private renderCampaigns(campaigns: ICampaignWithId[]) {
    return (
      <Box animation={{ type: "slideDown", duration: 200 }}>
        <Accordion multiple>
          {campaigns.map(campaign => (
            <Campaign campaign={campaign} />
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
      documentTypeName: "Campaign",
      onAdd: async document => {
        document.dateCreated = new Date();
        await addCampaign(project.id, document);
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
