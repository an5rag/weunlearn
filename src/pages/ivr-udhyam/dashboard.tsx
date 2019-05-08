import React from "react";
import {
  Box,
  ResponsiveContext,
  Text,
  Accordion,
  AccordionPanel,
  Heading,
  DataTable,
  Button
} from "grommet";
import { mockCampaigns, mockBlasts } from "./data.mocks";
import moment from "moment";
import { ISession } from "./data.types";
import { Add } from "grommet-icons";

export class Dashboard extends React.Component {
  render = () => (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          direction="column"
          pad={{ vertical: "large", horizontal: "large" }}
          align="start"
        >
          <Heading
            color="brand"
            level="1"
            textAlign="center"
            style={{ alignSelf: "center" }}
          >
            Stereo (Udhyam Pilot)
          </Heading>
          <Button
            icon={<Add />}
            label="New Campaign"
            onClick={() => {}}
            primary
          />
          <Accordion multiple>
            {mockCampaigns.map((campaign, i) => (
              <AccordionPanel
                key={campaign.id}
                label={
                  <Heading color="neutral-4" level="3">
                    {campaign.name}
                  </Heading>
                }
              >
                <Box margin={{ left: "medium" }} align="start" gap="medium">
                  <Text>
                    <b>Description: </b>
                    {campaign.description}
                  </Text>
                  <Button
                    icon={<Add />}
                    label="New Blast"
                    onClick={() => {}}
                    primary
                  />
                  <Accordion multiple>
                    {mockBlasts.map(blast => (
                      <AccordionPanel
                        label={
                          <Text
                            color="neutral-3"
                            size="medium"
                            margin={{ vertical: "small" }}
                          >
                            Blast done {moment(blast.dateStarted).fromNow()} (
                            {moment(blast.dateStarted).format("MMMM Do h:mm a")}
                            )
                          </Text>
                        }
                        key={blast.id}
                      >
                        <DataTable
                          margin="medium"
                          columns={[
                            {
                              property: "name",
                              header: <Text>Name</Text>,
                              primary: false,
                              render: (datum: ISession) => datum.userName
                            },
                            {
                              property: "phoneNumber",
                              header: "Phone Number",
                              primary: true,
                              render: (datum: ISession) => datum.phoneNumber
                            },
                            {
                              property: "duration",
                              header: "Duration",
                              render: (datum: ISession) =>
                                datum.duration
                                  ? `${Math.floor(datum.duration / 60)}:${get2D(
                                      datum.duration % 60
                                    )}`
                                  : "Unknown"
                            }
                          ]}
                          data={blast.sessions}
                        />
                      </AccordionPanel>
                    ))}
                  </Accordion>
                </Box>
              </AccordionPanel>
            ))}
          </Accordion>
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}

function get2D(num: number): string {
  if (num.toString().length < 2)
    // Integer of less than two digits
    return "0" + num; // Prepend a zero!
  return num.toString(); // return string for consistency
}
