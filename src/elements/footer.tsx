import React from "react";
import { Box, ResponsiveContext, Text } from "grommet";
import { Logo } from "./logo/logo";
import { SocialMedia } from "./socialMedia";

const Footer = ({ ...rest }) => (
  <ResponsiveContext.Consumer>
    {size => (
      <Box
        direction="row"
        justify="center"
        border={{ side: "top", color: "light-4" }}
        pad={{ vertical: "large" }}
        {...rest}
      >
        <Box align="center" gap="medium">
          <Logo type="minimal" />
          <SocialMedia />
          <Text size="small">
          © We Unlearn 2019
          </Text>
        </Box>
      </Box>
    )}
  </ResponsiveContext.Consumer>
);

export { Footer };
