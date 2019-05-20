import React from "react";
import {
  IContactGroupWithID,
  IContactGroup
} from "../../../../services/contactGroups/types";
import { Text, Select, Box, Button } from "grommet";
import { Add, Edit, Trash } from "grommet-icons";
import {
  DocumentConfigurer,
  ConfigurerState,
  DocumentConfigurerProps,
  PropertyType
} from "./documentConfigurer";
import {
  addContactGroup,
  updateContactGroup,
  deleteContactGroup
} from "../../../../services/contactGroups/crud";

export interface ContactGroupBarProps {
  onContactGroupChanged(id: string): void;
  selectedContactGroupId: string;
  contactGroups: IContactGroupWithID[];
}
export interface ContactGroupBarState {
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
}

const allContactGroup: IContactGroupWithID = {
  description: "List of all contacts.",
  name: "All Contacts",
  id: ""
};

export class ContactGroupBar extends React.Component<
  ContactGroupBarProps,
  ContactGroupBarState
> {
  constructor(props: ContactGroupBarProps) {
    super(props);
    this.state = {
      configurerState: ConfigurerState.Add,
      isConfigurerOpen: false
    };
  }

  render() {
    return (
      <Box
        margin="medium"
        width="100%"
        direction="column"
        align="start"
        gap="medium"
      >
        {this.renderGroupConfigurer()}
        {this.renderGroupPicker()}
        {this.renderGroupDescription()}
      </Box>
    );
  }

  private renderGroupPicker(): JSX.Element {
    const selectedContactGroup = this.getSelectedContactGroup();
    const value: IContactGroupWithID = selectedContactGroup || {
      name: "Unknown",
      id: "unknown",
      description: "Unknown."
    };
    const buttonStyles: React.CSSProperties = {
      border: "none",
      borderRadius: "0"
    };
    return (
      <Box width="100%" direction="row" align="center" gap="medium">
        <Select
          id="selectContactGroup"
          placeholder="Select"
          value={value}
          options={[allContactGroup, ...this.props.contactGroups]}
          onChange={({ option }: { option: IContactGroupWithID }) =>
            this.props.onContactGroupChanged(option.id)
          }
          labelKey="name"
          valueKey="id"
        />
        <Button
          style={buttonStyles}
          icon={<Edit />}
          disabled={this.props.selectedContactGroupId === ""}
          onClick={() => {
            this.setState({
              configurerState: ConfigurerState.Edit,
              isConfigurerOpen: true
            });
          }}
        />
        <Button
          style={buttonStyles}
          icon={<Trash />}
          disabled={this.props.selectedContactGroupId === ""}
          onClick={() => {
            this.setState({
              configurerState: ConfigurerState.Delete,
              isConfigurerOpen: true
            });
          }}
        />
        <Button
          style={{ border: "none" }}
          icon={<Add />}
          label="Add Contact Group"
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

  private renderGroupConfigurer(): JSX.Element {
    const selectedContactGroup = this.getSelectedContactGroup();
    const documentConfigurerProps: DocumentConfigurerProps<IContactGroup> = {
      configurerState: this.state.configurerState,
      isOpen: this.state.isConfigurerOpen,
      onDismiss: () => this.setState({ isConfigurerOpen: false }),
      document:
        this.state.configurerState === ConfigurerState.Edit
          ? selectedContactGroup
          : undefined,
      documentTypeName: "Contact Group",
      onAdd: async document => {
        const newGroupId = await addContactGroup(document);
        this.setState({ isConfigurerOpen: false });
        this.props.onContactGroupChanged(newGroupId);
      },
      onUpdate: async document => {
        await updateContactGroup(this.props.selectedContactGroupId, document);
        this.setState({ isConfigurerOpen: false });
      },
      onDelete: async () => {
        await deleteContactGroup(this.props.selectedContactGroupId);
        this.setState({ isConfigurerOpen: false });
        this.props.onContactGroupChanged("");
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
          placeholder: "Enter name of the group"
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
          placeholder: "Describe the group's intent"
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

  private renderGroupDescription(): JSX.Element {
    const selectedContactGroup = this.getSelectedContactGroup();

    if (selectedContactGroup) {
      return <Text>{selectedContactGroup.description}</Text>;
    } else {
      return <Text>Unknown group selected.</Text>;
    }
  }

  private getSelectedContactGroup(): IContactGroupWithID | undefined {
    if (this.props.selectedContactGroupId === "") {
      return allContactGroup;
    }
    return this.props.contactGroups.find(
      contactList => contactList.id === this.props.selectedContactGroupId
    );
  }
}
