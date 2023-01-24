import React, { Component } from "react";
import GreetingsEmbeddedDoc from "../GreetingsEmbeddedDoc/GreetingsEmbeddedDoc";

export default class Greetings2012 extends Component {
  render() {
    return (
      <GreetingsEmbeddedDoc
        width={1050}
        height={710}
        iFrameSource="https://docs.google.com/document/d/e/2PACX-1vRAd_ZpJ3Z1eg804ckeSa57WMBxovwrfioPmINiWMPylhH6lRwxUXBoJScu__u-6qBwnuZSnTQV79EB/pub?embedded=true"
      />
    );
  }
}
