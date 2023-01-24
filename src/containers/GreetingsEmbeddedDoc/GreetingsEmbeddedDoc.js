import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./GreetingsEmbeddedDoc.module.scss";

export default class GreetingsEmbeddedDoc extends Component {
  static propTypes = {
    iFrameSource: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  render() {
    const { width, height, iFrameSource } = this.props;
    // const styles = require("./GreetingsEmbeddedDoc.scss");
    return (
      <div className={`${styles.container}`}>
        <iframe
          width={width}
          height={height}
          src={iFrameSource}
          title="embedded doc"
        ></iframe>
      </div>
    );
  }
}
