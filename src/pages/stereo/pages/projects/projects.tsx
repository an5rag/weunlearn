import React from "react";
import {
  getProjectsSubscription,
  addProject,
  updateProject,
  deleteProject
} from "../../services/projects/crud";
import { IProjectWithId, IProject } from "../../services/projects/types";
import { Box, Heading, Button } from "grommet";
import { Add, Edit } from "grommet-icons";
import {
  ConfigurerState,
  DocumentConfigurerProps,
  PropertyType,
  DocumentConfigurer
} from "../../elements/documentConfigurer";
import { LoadingImage } from "../../../../elements/loadingImage";
import { Link, RouteComponentProps } from "react-router-dom";

interface ProjectsState {
  projects: IProjectWithId[];
  loading: boolean;
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
  projectIdToEdit: string;
}
export class Projects extends React.Component<
  RouteComponentProps,
  ProjectsState
> {
  private projectsSubscription: () => void;
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      projects: [],
      configurerState: ConfigurerState.Add,
      isConfigurerOpen: false,
      loading: true,
      projectIdToEdit: ""
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
      <Box direction="row" justify="center" width="large" margin="medium" wrap>
        {this.renderProjectConfigurer()}
        {this.state.projects.map(this.renderProjectBox)}
        {this.renderNewProjectBox()}
      </Box>
    );
  }

  private renderProjectBox = (project: IProjectWithId) => {
    const buttonStyles: React.CSSProperties = {
      border: "none",
      borderRadius: "0"
    };
    return (
      <Box
        height="150px"
        width="150px"
        background="brand"
        margin="small"
        key={project.id}
        align="center"
        justify="center"
      >
        <Link
          to={`${this.props.match.url}/project/${project.id}`}
          style={{
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <Heading level="4">{project.name}</Heading>
        </Link>
        <Button
          style={buttonStyles}
          icon={<Edit />}
          onClick={() => {
            this.setState({
              configurerState: ConfigurerState.Edit,
              isConfigurerOpen: true,
              projectIdToEdit: project.id
            });
          }}
        />
      </Box>
    );
  };

  private renderNewProjectBox() {
    return (
      <Box
        height="150px"
        margin="small"
        width="150px"
        align="center"
        justify="center"
        border={{
          color: "brand",
          side: "all",
          size: "small",
          style: "dashed"
        }}
        onClick={() => {
          this.setState({
            configurerState: ConfigurerState.Add,
            isConfigurerOpen: true
          });
        }}
        style={{
          cursor: "pointer"
        }}
      >
        <Add />
      </Box>
    );
  }

  private renderProjectConfigurer(): JSX.Element {
    const documentConfigurerProps: DocumentConfigurerProps<IProject> = {
      configurerState: this.state.configurerState,
      isOpen: this.state.isConfigurerOpen,
      onDismiss: () => this.setState({ isConfigurerOpen: false }),
      document:
        this.state.configurerState === ConfigurerState.Edit
          ? this.state.projects.find(
              project => project.id === this.state.projectIdToEdit
            )
          : undefined,

      documentTypeName: "Project",
      onAdd: async document => {
        document.dateCreated = new Date();
        await addProject(document);
        this.setState({ isConfigurerOpen: false });
      },
      onUpdate: async document => {
        await updateProject(this.state.projectIdToEdit, document);
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
        key={this.state.configurerState + "" + this.state.projectIdToEdit}
        {...documentConfigurerProps}
      />
    );
  }
}
