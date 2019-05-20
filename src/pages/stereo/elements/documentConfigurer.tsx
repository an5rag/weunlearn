import React from "react";
import { ActionModal } from "./actionModal/actionModal";
import { TextInput, FormField, Paragraph, Select } from "grommet";

export enum ConfigurerState {
  Add,
  Edit,
  Delete
}
export enum PropertyType {
  String,
  Number,
  Select,
  MultiSelect
}
export type SelectOption = { key: string; label: string };
export interface Property<T = Object> {
  label: string;
  key: string;
  type: PropertyType;
  getValue(document: T): any;
  onChange(value: any | any[], document: T): T;
  options?: SelectOption[];
  placeholder?: string;
}

export interface DocumentConfigurerProps<T = Object> {
  configurerState: ConfigurerState;
  documentTypeName: string;
  isOpen: boolean;
  onDismiss: () => void;
  document?: T;
  onUpdate(document: T): Promise<void>;
  onDelete(): Promise<void>;
  onAdd(document: T): Promise<void>;
  properties: Property<T>[];
}

export interface DocumentConfigurerState {
  document: Object;
  actionExecuting: boolean;
}

export class DocumentConfigurer extends React.Component<
  DocumentConfigurerProps,
  DocumentConfigurerState
> {
  constructor(props: DocumentConfigurerProps) {
    super(props);
    this.state = {
      actionExecuting: false,
      document: this.props.document || {}
    };
  }

  render() {
    return (
      <ActionModal
        isOpen={this.props.isOpen}
        onDismiss={() => {
          if (this.state.actionExecuting) {
            return;
          }
          this.props.onDismiss();
        }}
        actionButtonProps={{
          label: this.getActionLabel(),
          onClick: async () => {
            this.setState({ actionExecuting: true });
            const action = this.getOnAction();
            await action();
            this.setState({ actionExecuting: false });
          },
          disabled: this.state.actionExecuting,
          color:
            this.props.configurerState === ConfigurerState.Delete
              ? "status-critical"
              : "brand"
        }}
        headerLabel={`${this.getActionLabel()} ${this.props.documentTypeName}`}
      >
        {this.props.configurerState === ConfigurerState.Delete ? (
          <Paragraph>Are you sure? This action is irreversible.</Paragraph>
        ) : (
          this.props.properties.map(this.mapProperty)
        )}
      </ActionModal>
    );
  }

  private mapProperty = (property: Property): JSX.Element => {
    const value = property.getValue(this.state.document);
    const onChange = (value: any) =>
      this.setState({
        document: property.onChange(value, this.state.document)
      });
    switch (property.type) {
      case PropertyType.String:
        return (
          <FormField label={property.label} key={property.key}>
            <TextInput
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={property.placeholder}
            />
          </FormField>
        );
      case PropertyType.MultiSelect:
        let valueOptions: SelectOption[] = value.length
          ? value.map((value: string) => {
              return (
                property.options &&
                property.options.find(option => option.key === value)
              );
            })
          : [];
        valueOptions = valueOptions.filter(value => !!value);
        return (
          <FormField label={property.label} key={property.key}>
            <Select
              options={property.options || []}
              value={valueOptions}
              onChange={e =>
                onChange(e.value.map((value: SelectOption) => value.key))
              }
              labelKey="label"
              valueKey="key"
              multiple
              placeholder={property.placeholder}
            />
          </FormField>
        );
      default:
        return <>Unknown property</>;
    }
  };

  private getActionLabel(): string {
    switch (this.props.configurerState) {
      case ConfigurerState.Add:
        return this.state.actionExecuting ? "Adding" : "Add";
      case ConfigurerState.Edit:
        return this.state.actionExecuting ? "Updating" : "Update";
      case ConfigurerState.Delete:
        return this.state.actionExecuting ? "Deleting" : "Delete";
    }
    return "";
  }

  private getOnAction(): () => Promise<void> {
    switch (this.props.configurerState) {
      case ConfigurerState.Add:
        return () => this.props.onAdd(this.state.document);
      case ConfigurerState.Edit:
        return () => this.props.onUpdate(this.state.document);
      case ConfigurerState.Delete:
        return () => this.props.onDelete();
    }
  }
}
