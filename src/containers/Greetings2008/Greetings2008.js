import src from "images/Phillips Christmas letter 2008.pdf";
import React, { Component } from "react";

export default class Greetings2008 extends Component {
  render() {
    return (
      <iframe
        src={src}
        width="100%"
        height={1800}
        title="Philips Christmas letter 2008"
      />
    );
  }
}
