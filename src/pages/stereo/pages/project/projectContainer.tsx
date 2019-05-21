import React from "react";
import { RouteComponentProps } from "react-router";
import { ProjectProps, Project } from "./project";
import { getProject } from "../../services/projects/crud";
import { getCampaignsSubscription } from "../../services/campaigns/crud";

export interface ProjectContainerProps
  extends RouteComponentProps<{ projectId: string }> {}

export class ProjectContainer extends React.Component<
  ProjectContainerProps,
  ProjectProps
> {
  private campaignsSubscription: () => void;
  constructor(props: ProjectContainerProps) {
    super(props);
    this.campaignsSubscription = () => {};
  }

  componentDidMount() {
    getProject(this.props.match.params.projectId).then(project => {
      this.setState({ project });
      if (project) {
        this.campaignsSubscription = getCampaignsSubscription(
          project.id,
          campaigns => {
            this.setState({ campaigns });
          }
        );
      } else {
        alert("Project not found");
      }
    });
  }

  componentWillUnmount() {
    this.campaignsSubscription();
  }

  render() {
    return <Project {...this.state} />;
  }
}
