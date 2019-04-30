import React from "react";
import { Anchor, Box } from "grommet";
import { FacebookOption, Instagram, Twitter } from "grommet-icons";

const SocialMedia = () => (
  <Box direction="row" gap="xxsmall" justify="center" align="center">
    <Anchor
      target="_blank"
      href="https://www.instagram.com/weunlearn"
      icon={<Instagram color="brand" size="medium" />}
    />
    <Anchor
      target="_blank"
      href="https://www.facebook.com/theirrelevantproject"
      icon={<FacebookOption color="brand" size="medium" />}
    />
    <Anchor
      target="_blank"
      href="https://twitter.com/IrrelevantProj"
      icon={<Twitter color="brand" size="medium" />}
    />
  </Box>
);

export { SocialMedia };
