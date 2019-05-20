import React from "react";
import { getContactsSubscription } from "../../../../services/contacts/crud";
import { ContactsTable } from "./contactsTable";
import { IContactGroupWithID } from "../../../../services/contactGroups/types";
import { IContactWithID } from "../../../../services/contacts/types";

export interface ContactsTableContainerProps {
  groupId?: string;
  contactGroups: IContactGroupWithID[];
}

export interface ContactsTableContainerState {
  contacts: IContactWithID[];
  loading: boolean;
}

export class ContactsTableContainer extends React.Component<
  ContactsTableContainerProps,
  ContactsTableContainerState
> {
  private contactSubscription: () => void;
  constructor(props: ContactsTableContainerProps) {
    super(props);
    this.state = {
      contacts: [],
      loading: true
    };
    this.contactSubscription = () => {};
  }

  componentDidMount() {
    this.contactSubscription = this.subscribeToGetContacts(this.props.groupId);
  }

  componentDidUpdate(oldProps: ContactsTableContainerProps) {
    if (this.props.groupId !== oldProps.groupId) {
      this.setState({ loading: true });
      this.contactSubscription();
      this.contactSubscription = this.subscribeToGetContacts(
        this.props.groupId
      );
    }
  }

  componentWillUnmount() {
    this.contactSubscription();
  }

  render() {
    return (
      <ContactsTable
        {...this.state}
        contactGroups={this.props.contactGroups}
        groupId={this.props.groupId}
      />
    );
  }

  private subscribeToGetContacts(groupId?: string) {
    return getContactsSubscription(contacts => {
      this.setState({ contacts, loading: false });
    }, groupId);
  }
}
