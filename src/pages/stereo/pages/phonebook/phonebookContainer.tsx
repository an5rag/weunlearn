import React from "react";
import { PhonebookProps, Phonebook } from "./phonebook";
import { getContactGroupsSubscription } from "../../services/contactGroups/crud";

export class PhonebookContainer extends React.Component<{}, PhonebookProps> {
  private contactGroupsSubscription: () => void;
  constructor(props: {}) {
    super(props);
    this.state = {
      contactGroups: []
    };
    this.contactGroupsSubscription = () => {};
  }

  componentDidMount() {
    this.contactGroupsSubscription = getContactGroupsSubscription(
      contactGroups => {
        this.setState({ contactGroups });
      }
    );
  }

  componentWillUnmount() {
    this.contactGroupsSubscription();
  }

  render() {
    return <Phonebook {...this.state} />;
  }
}
