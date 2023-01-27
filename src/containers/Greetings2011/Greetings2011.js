import React, { Component } from "react";
export default class Greetings2011 extends Component {
  render() {
    const src = process.env.PUBLIC_URL + "/Phillips Christmas Letter 2011.pdf";
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
