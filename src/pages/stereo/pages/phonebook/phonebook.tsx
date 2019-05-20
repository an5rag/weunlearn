import * as React from "react";
import { ContactsTableContainer } from "./elements/contactsTable/contactsTableContainer";
import { Box } from "grommet";
import { ContactGroupBar } from "./elements/contactGroupBar/contactGroupBar";
import { IContactGroupWithID } from "../../services/contactGroups/types";

export interface PhonebookState {
  selectedContactGroupId: string;
}

export interface PhonebookProps {
  contactGroups: IContactGroupWithID[];
}

export class Phonebook extends React.Component<PhonebookProps, PhonebookState> {
  public state: PhonebookState = {
    selectedContactGroupId: ""
  };
  render() {
    return (
      <Box width="xlarge" align="center">
        <ContactGroupBar
          selectedContactGroupId={this.state.selectedContactGroupId}
          onContactGroupChanged={this.onContactGroupIdChanged}
          contactGroups={this.props.contactGroups}
        />
        <ContactsTableContainer
          groupId={this.state.selectedContactGroupId}
          contactGroups={this.props.contactGroups}
        />
      </Box>
    );
  }

  private onContactGroupIdChanged = (contactGroupId: string): void => {
    this.setState({
      selectedContactGroupId: contactGroupId
    });
  };
}
