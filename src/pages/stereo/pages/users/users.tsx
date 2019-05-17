import * as React from "react";

import { Box, DataTable, Meter, Text, DataTableProps } from "grommet";
const DATA = [
  {
    name: "Alan",
    location: "",
    date: "",
    percent: 0,
    paid: 0
  },
  {
    name: "Bryan",
    location: "Fort Collins",
    date: "2018-06-10",
    percent: 30,
    paid: 1234
  },
  {
    name: "Chris",
    location: "Palo Alto",
    date: "2018-06-09",
    percent: 40,
    paid: 2345
  },
  {
    name: "Eric",
    location: "Palo Alto",
    date: "2018-06-11",
    percent: 80,
    paid: 3456
  },
  {
    name: "Doug",
    location: "Fort Collins",
    date: "2018-06-10",
    percent: 60,
    paid: 1234
  },
  {
    name: "Jet",
    location: "Palo Alto",
    date: "2018-06-09",
    percent: 40,
    paid: 3456
  },
  {
    name: "Michael",
    location: "Boise",
    date: "2018-06-11",
    percent: 50,
    paid: 1234
  },
  {
    name: "Tracy",
    location: "San Francisco",
    date: "2018-06-10",
    percent: 10,
    paid: 2345
  }
];

const columns: DataTableProps["columns"] = [
  {
    property: "name",
    header: <Text>Name with extra</Text>,
    primary: true,
    footer: "Total"
  },
  {
    property: "location",
    header: "Location"
  },
  {
    property: "date",
    header: "Date",
    render: (datum: any) =>
      datum.date && new Date(datum.date).toLocaleDateString("en-US"),
    align: "end"
  },
  {
    property: "percent",
    header: "Percent Complete",
    render: (datum: any) => (
      <Box pad={{ vertical: "xsmall" }}>
        <Meter
          values={[{ label: "", value: datum.percent }]}
          thickness="small"
          size="small"
        />
      </Box>
    )
  },
  {
    property: "paid",
    header: "Paid",
    render: (datum: any) => datum.paid / 100,
    align: "end",
    aggregate: "sum",
    footer: { aggregate: true }
  }
];

export const Users = (props: {}) => {
  return (
    <>
      {" "}
      <Box align="center" pad="large">
        <DataTable
          columns={columns.map(c => ({
            ...c,
            search: c.property === "name" || c.property === "location"
          }))}
          data={DATA}
          sortable
          resizeable
        />
      </Box>
    </>
  );
};
