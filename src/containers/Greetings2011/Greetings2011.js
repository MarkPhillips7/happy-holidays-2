import src from "images/Phillips Christmas Letter 2011.pdf";
import React, { Component } from "react";
export default class Greetings2011 extends Component {
  render() {
    return (
      <iframe
        src={src}
        width="100%"
        height={1200}
        title="Philips Christmas letter 2011"
      />
    );
  }
}
