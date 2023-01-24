import React, { Component } from "react";
import GreetingsEmbeddedDoc from "../GreetingsEmbeddedDoc/GreetingsEmbeddedDoc";

export default class Greetings2014 extends Component {
  render() {
    return (
      <GreetingsEmbeddedDoc
        width={850}
        height={1930}
        iFrameSource="https://docs.google.com/document/d/e/2PACX-1vTR2ar0j5VoCC15TXPhbuKWScKaI13ivY1r3mn3Ji-EVfmszbWcu-NCRV1GzXvUE2212wTS00aUU1YI/pub?embedded=true"
      />
    );
  }
}
