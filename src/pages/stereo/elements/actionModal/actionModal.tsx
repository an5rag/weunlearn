import React, { CSSProperties } from "react";
import ReactModal from "react-modal";
import { ActionModalProps } from "./actionModal.types";
import { Box, Heading, Button } from "grommet";
function getParent() {
  return document.querySelector("#app-root") as HTMLElement;
}
export class ActionModal extends React.Component<ActionModalProps> {
  render() {
    const overlayStyles: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };

    const contentStyles: CSSProperties = {
      padding: 0,
      position: "static",
      overflow: "hidden",
      borderRadius: 0,
      border: "0.5px solid #ccc",
      width: "400px"
    };
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={e => this.props.onDismiss()}
        style={{
          overlay: overlayStyles,
          content: contentStyles
        }}
        parentSelector={getParent}
        closeTimeoutMS={100}
      >
        <Box width="100%" height="100%" pad="medium" gap="medium">
          <Heading level="3" margin="0">
            {this.props.headerLabel}
          </Heading>
          <div
            style={{
              flexGrow: 1,
              minHeight: "100px",
              maxHeight: "500px",
              overflow: "auto"
            }}
          >
            {this.props.children}
          </div>
          <Box direction="row" gap="medium" align="center" justify="end">
            <Button primary {...this.props.actionButtonProps} />
            <Button label="Cancel" onClick={this.props.onDismiss} />
          </Box>
        </Box>
      </ReactModal>
    );
  }
}
