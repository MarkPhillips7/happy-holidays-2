import React, { Component } from "react";
import GreetingsEmbeddedDoc from "../GreetingsEmbeddedDoc/GreetingsEmbeddedDoc";

export default class Greetings2011 extends Component {
  render() {
    return (
      <GreetingsEmbeddedDoc
        width={820}
        height={1100}
        iFrameSource="https://drive.google.com/file/d/1g6Phb6q-vwdZ0zL4QLVtyKJQYLpPI9o5/preview"
      />
    );
  }
}
