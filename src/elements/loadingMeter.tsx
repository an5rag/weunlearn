import React from "react";

import { Meter, MeterProps } from "grommet";

export class LoadingMeter extends React.Component<MeterProps> {
  state = { value: 0 };
  private timer: number | undefined;

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ value: (this.state.value + 1) % 100 });
    }, 1);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { value } = this.state;
    return (
      <Meter
        type="circle"
        background="light-2"
        size="xsmall"
        thickness="small"
        values={[{ label: "", value, color: "brand" }]}
      />
    );
  }
}
