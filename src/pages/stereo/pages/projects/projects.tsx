import React from "react";
import {
  getProjectsSubscription,
  addProject,
  updateProject,
  deleteProject
} from "../../services/projects/crud";
import { IProjectWithId, IProject } from "../../services/projects/types";
import { Box, Heading, Button } from "grommet";
import { Add } from "grommet-icons";
import {
  ConfigurerState,
  DocumentConfigurerProps,
  PropertyType,
  DocumentConfigurer
} from "../../elements/documentConfigurer";
import { LoadingImage } from "../../../../elements/loadingImage";

interface ProjectsState {
  projects: IProjectWithId[];
  loading: boolean;
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
}
export class Projects extends React.Component<{}, ProjectsState> {
  private projectsSubscription: () => void;
  constructor(props: {}) {
    super(props);
    this.state = {
      projects: [],
      configurerState: ConfigurerState.Add,
      isConfigurerOpen: false,
      loading: true
    };
    this.projectsSubscription = () => {};
  }

  componentDidMount() {
    this.projectsSubscription = getProjectsSubscription(projects => {
      this.setState({ projects: projects, loading: false });
    });
  }

  componentWillUnmount() {
    this.projectsSubscription();
  }

  render() {
    if (this.state.loading) {
      return (
        <Box width="100%" align="center">
          <LoadingImage />
        </Box>
      );
    }
    return (
      <Box
        gap="large"
        direction="row"
        justify="center"
        width="large"
        margin="large"
      >
        {this.renderProjectConfigurer()}
        {this.state.projects.map(this.renderProjectBox)}
        {this.renderNewProjectBox()}
      </Box>
    );
  }

  private renderProjectBox(project: IProjectWithId) {
    return (
      <Box
        height="150px"
        width="150px"
        align="center"
        justify="center"
        background="brand"
      >
        <Heading level="4">{project.name}</Heading>
      </Box>
    );
  }

  private renderNewProjectBox() {
    return (
      <Box
        height="150px"
        width="150px"
        align="center"
        justify="center"
        border={{
          color: "brand",
          side: "all",
          size: "small",
          style: "dashed"
        }}
      >
        <Button
          icon={<Add />}
          onClick={() => {
            this.setState({
              configurerState: ConfigurerState.Add,
              isConfigurerOpen: true
            });
          }}
        />
      </Box>
    );
  }

  private renderProjectConfigurer(): JSX.Element {
    const documentConfigurerProps: DocumentConfigurerProps<IProject> = {
      configurerState: this.state.configurerState,
      isOpen: this.state.isConfigurerOpen,
      onDismiss: () => this.setState({ isConfigurerOpen: false }),

      documentTypeName: "Project",
      onAdd: async document => {
        await addProject(document);
        this.setState({ isConfigurerOpen: false });
      },
      onUpdate: async document => {
        await updateProject("foobar", document);
        this.setState({ isConfigurerOpen: false });
      },
      onDelete: async () => {
        await deleteProject("foobar");
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
          placeholder: "Enter name of the project"
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
          placeholder: "Describe the project's scope"
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
