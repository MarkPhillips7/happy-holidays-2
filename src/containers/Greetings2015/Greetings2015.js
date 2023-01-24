import React, { Component } from "react";
// import {connect} from 'react-redux';
// had to move the SnowScene reference to componentDidMount
import SnowScene from "./snowScene";

export default class Greetings2015 extends Component {
  componentDidMount() {
    // const SnowScene = require("./snowScene");
    const snowScene = SnowScene.getInstance();
    snowScene.initialize();
  }

  componentWillUnmount() {
    // const SnowScene = require("./snowScene");
    const snowScene = SnowScene.getInstance();
    snowScene.remove();
  }

  pause = () => {
    // const SnowScene = require("./snowScene");
    const snowScene = SnowScene.getInstance();
    snowScene.pause();
  };

  restartSnowScene = () => {
    // const SnowScene = require("./snowScene");
    const snowScene = SnowScene.getInstance();
    snowScene.playFromBeginning();
  };
  render() {
    return (
      <div className="container">
        <h1 style={{ textAlign: "center", margin: 15 }}>
          Happy Holidays from the Phillips Family
        </h1>
        {/* <DocumentMeta title={config.app.title + ''}/> */}

        <div style={{ textAlign: "center", margin: 15 }}>
          <button
            className="btn btn-primary"
            onClick={this.pause}
            style={{ marginRight: 15 }}
          >
            <i className="fa fa-pause" /> Pause
          </button>
          <button className="btn btn-primary" onClick={this.restartSnowScene}>
            <i className="fa fa-refresh" /> Replay
          </button>
        </div>

        <h3 id="LoadingChristmasMagic" className="centered text-center">
          <i className="fa fa-spinner fa-spin"></i> Loading Christmas Magic...
        </h3>
      </div>
    );
  }
}
