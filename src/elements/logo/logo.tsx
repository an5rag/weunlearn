import React from "react";

import { Box, Image } from "grommet";
import fullLogo from "./full.png";
import minimalLogo from "./minimal.png";

export interface LogoProps {
  type: "minimal" | "full"
}
const Logo = (props: LogoProps) => (
    <Box
      width={"100px"}
      height={"100px"}
      align="center"
      justify="center"
    >
    <Image fit="contain" src={props.type === "minimal"? minimalLogo:fullLogo} style={{maxWidth: '100%'}}/>
    </Box>

);

export { Logo };
