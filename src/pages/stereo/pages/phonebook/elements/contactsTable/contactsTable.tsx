import * as React from "react";
import { DataTable, Text, CheckBox, Box, Button } from "grommet";
import { IContactWithID, IContact } from "../../../../services/contacts/types";
import { LoadingImage } from "../../../../../../elements/loadingImage";
import { Add, Edit, Trash } from "grommet-icons";
import { IContactGroupWithID } from "../../../../services/contactGroups/types";
import {
  ConfigurerState,
  DocumentConfigurerProps,
  PropertyType,
  DocumentConfigurer
} from "../../../../elements/documentConfigurer";
import {
  addContact,
  updateContact,
  deleteContact
} from "../../../../services/contacts/crud";

export interface ContactsTableProps {
  contacts: IContactWithID[];
  contactGroups: IContactGroupWithID[];
  loading: boolean;
  groupId?: string;
}

interface ContactsTableState {
  checked: string[];
  configurerState: ConfigurerState;
  isConfigurerOpen: boolean;
}

export class ContactsTable extends React.Component<
  ContactsTableProps,
  ContactsTableState
> {
  public state: ContactsTableState = {
    checked: [],
    configurerState: ConfigurerState.Add,
    isConfigurerOpen: false
  };
  componentDidUpdate(oldProps: ContactsTableProps) {
    if (oldProps !== this.props) {
      this.setState({
        checked: []
      });
    }
  }
  render() {
    return (
      <>
        {this.renderContactConfigurer()}
        {this.renderCommandBar()}
        {this.props.loading ? (
          <LoadingImage />
        ) : this.props.contacts.length ? (
          this.renderTable()
        ) : (
          <Text>No records to display.</Text>
        )}
      </>
    );
  }

  private renderTable(): JSX.Element {
    console.log(this.props);
    return (
      <div
        style={{
          width: "100%"
        }}
      >
        <DataTable
          columns={[
            {
              property: "checkbox",
              render: (datum: IContactWithID) => (
                <CheckBox
                  key={datum.id}
                  checked={this.state.checked.indexOf(datum.id) !== -1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    this.onCheck(e, datum.id)
                  }
                />
              ),
              header: (
                <CheckBox
                  checked={
                    this.state.checked.length === this.props.contacts.length
                  }
                  indeterminate={
                    this.state.checked.length > 0 &&
                    this.state.checked.length < this.props.contacts.length
                  }
                  onChange={this.onCheckAll}
                />
              ),
              sortable: false
            },
            {
              property: "name",
              render: (datum: IContactWithID) => datum.name,
              header: "Name",
              search: true
            },
            {
              property: "company",
              render: (datum: IContactWithID) => datum.company,
              header: "Company"
            },
            {
              property: "phone",
              render: (datum: IContactWithID) => datum.phone,
              header: "Phone Number",
              search: true
            },
            {
              property: "groups",
              render: (datum: IContactWithID) =>
                datum.groupIds &&
                datum.groupIds.map((groupId, i) => {
                  const group = this.props.contactGroups.find(
                    group => group.id === groupId
                  );
                  const groupName = group ? group.name : "Unknown";
                  return (
                    <Text>
                      {groupName}
                      {i < datum.groupIds.length - 1 ? ", " : ""}
                    </Text>
                  );
                }),
              header: "Groups",
              sortable: false
            },
            {
              property: "id",
              render: (datum: IContactWithID) => datum.id,
              header: "Id",
              primary: true
            }
          ]}
          data={this.props.contacts}
          resizeable
          sortable
        />
      </div>
    );
  }
  private renderCommandBar(): JSX.Element {
    const buttonStyles: React.CSSProperties = {
      border: "none",
      borderRadius: "0"
    };
    return (
      <Box
        margin="medium"
        pad="small"
        background="light-3"
        round="small"
        width="100%"
        direction="row"
        align="start"
      >
        <Button
          style={buttonStyles}
          icon={<Add />}
          label="Add Contact"
          onClick={() => {
            this.setState({
              configurerState: ConfigurerState.Add,
              isConfigurerOpen: true
            });
          }}
          hoverIndicator={{ background: "light-1" }}
        />
        <Button
          style={buttonStyles}
          icon={<Edit />}
          label="Edit Contact"
          disabled={this.state.checked.length !== 1}
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
          label={`Delete ${
            this.state.checked.length > 1
              ? `${this.state.checked.length} Contacts`
              : "Contact"
          }`}
          disabled={!this.state.checked.length}
          onClick={() => {
            this.setState({
              configurerState: ConfigurerState.Delete,
              isConfigurerOpen: true
            });
          }}
        />
      </Box>
    );
  }

  private renderContactConfigurer(): JSX.Element {
    const checkedDocuments = this.state.checked.map(id => {
      return this.props.contacts.find(contact => contact.id === id);
    });
    const firstCheckedDocument = checkedDocuments[0];
    const document =
      firstCheckedDocument &&
      this.state.configurerState === ConfigurerState.Edit
        ? firstCheckedDocument
        : {
            name: "",
            company: "",
            phone: "",
            groupIds: this.props.groupId ? [this.props.groupId] : []
          };
    const documentConfigurerProps: DocumentConfigurerProps<IContact> = {
      configurerState: this.state.configurerState,
      isOpen: this.state.isConfigurerOpen,
      onDismiss: () => this.setState({ isConfigurerOpen: false }),
      document,
      documentTypeName: "Contact",
      onAdd: async document => {
        await addContact(document);
        this.setState({ isConfigurerOpen: false });
      },
      onUpdate: async document => {
        if (firstCheckedDocument) {
          await updateContact(firstCheckedDocument.id, document);
          this.setState({ isConfigurerOpen: false });
        }
      },
      onDelete: async () => {
        const promises = checkedDocuments.map(document => {
          if (document) {
            return deleteContact(document.id);
          } else {
            return Promise.resolve();
          }
        });
        await Promise.all(promises);
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
          placeholder: "Enter name"
        },
        {
          key: "phone",
          type: PropertyType.String,
          getValue: document => document.phone,
          label: "Phone Number",
          onChange: (value, document) => ({
            ...document,
            phone: value
          }),
          placeholder: "Enter phone number"
        },
        {
          key: "company",
          type: PropertyType.String,
          getValue: document => document.company,
          label: "Company",
          onChange: (value, document) => ({
            ...document,
            company: value
          }),
          placeholder: "Enter company"
        },
        {
          key: "groups",
          type: PropertyType.MultiSelect,
          getValue: document => document.groupIds || [],
          options: this.props.contactGroups.map(cgroup => ({
            key: cgroup.id,
            label: cgroup.name
          })),
          label: "Groups",
          onChange: (values, document) => ({
            ...document,
            groupIds: values
          }),
          placeholder: "Choose Groups"
        }
      ]
    };
    return (
      <DocumentConfigurer
        key={
          this.state.configurerState +
          "" +
          this.props.groupId +
          this.state.checked.reduce((p, c) => p + "" + c, "")
        }
        {...documentConfigurerProps}
      />
    );
  }

  private onCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { checked } = this.state;
    if (event.target.checked) {
      checked.push(id);
      this.setState({ checked });
    } else {
      this.setState({
        checked: checked.filter(item => item !== id)
      });
    }
  };

  private onCheckAll = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({
      checked: event.target.checked
        ? this.props.contacts.map(datum => datum.id)
        : []
    });
}
