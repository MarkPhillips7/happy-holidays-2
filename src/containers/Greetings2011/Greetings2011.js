import React, { Component } from "react";
import GreetingsEmbeddedDoc from "../GreetingsEmbeddedDoc/GreetingsEmbeddedDoc";

export default class Greetings2011 extends Component {
  render() {
    return (
      <GreetingsEmbeddedDoc
        width={820}
        height={1100}
        iFrameSource="https://drive.google.com/file/d/0B3sKAi1tonvXM2JmYjQ3NzEtY2M3Mi00MDcxLWE5MDUtYzU1ZjdhNzE0MjUz/preview?resourceKey=0-ioFlJ2N1sdAZL0jOIuEJcw"
      />
    );
  }
}
