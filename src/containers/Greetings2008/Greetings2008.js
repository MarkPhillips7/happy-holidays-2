import React, { Component } from "react";
import GreetingsEmbeddedDoc from "../GreetingsEmbeddedDoc/GreetingsEmbeddedDoc";

export default class Greetings2008 extends Component {
  render() {
    return (
      <GreetingsEmbeddedDoc
        width={820}
        height={1300}
        iFrameSource="https://drive.google.com/file/d/1h97cLTU9_SYwZd9Dn-YYn_QeB4l1KNzI/preview"
        title="Philips Christmas letter 2008"
      />
    );
  }
}
