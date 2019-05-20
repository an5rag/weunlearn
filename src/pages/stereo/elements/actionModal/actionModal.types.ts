import { ButtonProps } from "grommet";

export interface ActionModalProps {
  headerLabel: string;
  actionButtonProps: ButtonProps;
  onDismiss: () => void;
  isOpen: boolean;
}
