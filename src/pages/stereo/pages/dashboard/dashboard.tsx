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
import moment from "moment";
import { ISession, ICampaign, ICampaignBroadcast } from "../../types";
import { Add } from "grommet-icons";
import { LoadingImage } from "../../../../elements/loadingImage";

export interface DashboardProps {
  campaigns?: ICampaign[];
}

export class Dashboard extends React.Component<DashboardProps> {
  render = () => (
    <ResponsiveContext.Consumer>
      {size => (
        <Box width="xlarge" direction="column" align="start">
          <Button
            icon={<Add />}
            label="New Campaign"
            onClick={() => {}}
            primary
          />
          {this.props.campaigns ? (
            this.renderCampaigns(this.props.campaigns)
          ) : (
            <Box width="100%" align="center">
              <LoadingImage />
            </Box>
          )}
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );

  private renderCampaigns(campaigns: ICampaign[]) {
    return (
      <Accordion multiple>
        {campaigns.map((campaign, i) => this.renderCampaign(campaign))}
      </Accordion>
    );
  }

  private renderCampaign(campaign: ICampaign) {
    return (
      <>
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
            <Text>
              <b>App ID: </b>
              {campaign.appId}
            </Text>
            <Button
              icon={<Add />}
              label="New Blast"
              onClick={() => {}}
              primary
            />
            <Accordion multiple>
              {campaign.blasts.map(this.renderBlast)}
            </Accordion>
          </Box>
        </AccordionPanel>
      </>
    );
  }

  private renderBlast(blast: ICampaignBroadcast) {
    return (
      <AccordionPanel
        label={
          <Text color="neutral-3" size="medium" margin={{ vertical: "small" }}>
            {blast.name}
          </Text>
        }
        key={blast.id}
      >
        <Text>
          <b>Made on: </b>
          {moment(blast.dateStarted).format("MMMM Do h:mm a")} (
          {moment(blast.dateStarted).fromNow()})
        </Text>
        <DataTable
          margin="medium"
          columns={[
            {
              property: "name",
              header: <Text>Name</Text>,
              primary: false,
              render: (datum: ISession) => datum.contactId
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
    );
  }
}

function get2D(num: number): string {
  if (num.toString().length < 2)
    // Integer of less than two digits
    return "0" + num; // Prepend a zero!
  return num.toString(); // return string for consistency
}
