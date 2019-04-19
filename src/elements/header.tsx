import React from "react";
import { Anchor, Box, ResponsiveContext } from "grommet";
import { Logo } from "./logo/logo";

export const NavHeader = () => (
  <ResponsiveContext.Consumer>
    {size => (
      <Box
        direction="row"
        justify="between"
        alignSelf="center"
        width="100%"
        pad={{
          top: "medium",
          horizontal: size === "large" ? "20%" : "xlarge"
        }}
      >
        <Anchor href="/" icon={<Logo type="full"/>} />
      </Box>
    )}
  </ResponsiveContext.Consumer>
);

export const StickyNavHeader = () => {
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <Box
            style={{
              width: "100%",
              position: "fixed",
              zIndex: 1,
              backgroundImage:
                size === "small"
                  ? "linear-gradient(to top, rgba(255, 255, 255,0), rgba(255, 255, 255,0.8))"
                  : ""
            }}
          >
            <NavHeader />
          </Box>
          <Box
            style={{
              visibility: "hidden"
            }}
          >
            <NavHeader />
          </Box>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
};
