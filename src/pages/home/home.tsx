import React from "react";
import { Heading, Paragraph, Image, ResponsiveContext, Text } from "grommet";
import { Announce, Info, Tools } from "grommet-icons";
import { Box } from "grommet/components/Box";
import { ContactForm } from "../../elements/contactForm";

export const Home = () => (
  <ResponsiveContext.Consumer>
    {size => (
      <Box
        animation="fadeIn"
        width="xlarge"
        className="home-root"
        pad={{ horizontal: "large", bottom: "xlarge" }}
        align="center"
        direction="column"
        gap="xlarge"
        margin="auto"
      >
        <Paragraph size="xlarge" textAlign="center" color="black">
          <b>
            We're empowering adolescents with the knowledge and skills to lead
            gender-equitable lives.
          </b>
        </Paragraph>
        <Box
          width="750px"
          style={{
            minHeight: size === "small" ? "150px" : "250px",
            height: size === "small" ? "150px" : "250px"
          }}
        >
          <Image
            src="https://www.rti.org/sites/default/files/styles/rti_banner_1600/public/impact-hero-images/india_ncd.jpg?itok=TornGi8D"
            fit="cover"
            style={{
              filter: "sepia(100%)"
            }}
          />
        </Box>
        <Box width="100%" align="center" justify="center" gap="large">
          <Heading level="2" textAlign="center">
            Our Pillars
          </Heading>
          <Box
            direction={size === "large" ? "row" : "column"}
            width="100%"
            justify="around"
            wrap
            gap="large"
          >
            <Box
              align="center"
              gap="medium"
              width={size === "large" ? "30%" : "100%"}
            >
              <Announce color="brand" size="large" />
              <Text textAlign="center">
                <b>Awareness</b>
              </Text>
              <Paragraph margin="none" size="medium" textAlign="center">
                of important themes such as consent, sex-education, gender
                stereotypes in everyday interactions / locations
              </Paragraph>
            </Box>
            <Box
              align="center"
              gap="medium"
              width={size === "large" ? "30%" : "100%"}
            >
              <Info color="brand" size="large" />
              <Text textAlign="center">
                <b>Information</b>
              </Text>
              <Paragraph margin="none" size="medium" textAlign="center">
                on laws protecting women / helping women such as domestic
                violence act, marriage act
              </Paragraph>
            </Box>
            <Box
              align="center"
              gap="medium"
              width={size === "large" ? "30%" : "100%"}
            >
              <Tools color="brand" size="large" />
              <Text textAlign="center">
                <b>Skills</b>
              </Text>
              <Paragraph margin="none" size="medium" textAlign="center">
                Life skills training on problem solving, negotiation skills to
                help them apply their awareness and information
              </Paragraph>
            </Box>
          </Box>
        </Box>
        <Box margin={{ vertical: "large" }} width="large" align="center">
          <Heading level="2" textAlign="center">
            Contact us
          </Heading>
          <ContactForm />
        </Box>
      </Box>
    )}
  </ResponsiveContext.Consumer>
);
