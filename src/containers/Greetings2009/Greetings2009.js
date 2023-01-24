import React, { Component } from "react";
import GreetingsEmbeddedDoc from "../GreetingsEmbeddedDoc/GreetingsEmbeddedDoc";

export default class Greetings2009 extends Component {
  render() {
    return (
      <GreetingsEmbeddedDoc
        width={850}
        height={1990}
        iFrameSource="https://docs.google.com/document/d/e/2PACX-1vQbPBTsOTZ7-zF67K555QUfr0joc1VYy_IBik49mrnDbNrs208DhOSMpJYU3rvOpk1lKdMPHt6HkcQC/pub?embedded=true"
      />
    );
  }
}
