import ReactDOM from "react-dom";
import React, { Component } from "react";
import { w3cwebsocket as w3WebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from "antd";

import "./index.css";
import "antd/dist/antd.css";

const client = new w3WebSocket("ws://127.0.0.1:8001");

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

export default class App extends Component {
  state = {
    userName: "",
    isLoggedIn: false,
    messages: [],
    currentMessage: "",
  };

  handleLogin = (value) => {
    this.setState({
      userName: value,
      isLoggedIn: true,
    });
  };

  handleSendMessage = (value) => {
    client.send(
      JSON.stringify({
        type: "message",
        message: value,
        user: this.state.userName,
      })
    );
    this.setState({ currentMessage: "" });
  };

  componentDidMount() {
    client.onopen = () => {
      console.log("websocket client connected 🤝 ");
    };

    client.onclose = () => {
      console.log("websocket client connection close 🚪  ");
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log(`got reply ${dataFromServer}`);

      if (dataFromServer.type === "message") {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              message: dataFromServer?.message,
              user: dataFromServer?.user,
            },
          ],
        }));
      }
    };
  }

  render() {
    return (
      <div className="main">
        {this.state.isLoggedIn ? (
          <div>
            <div className="app-title-container">
              <Text className="app-title" type="secondary">
                Websocket Chat
              </Text>
            </div>

            <div className="messages-container">
              {this.state.messages.map((message) => (
                <Card
                  key={message.message}
                  className="message-card"
                  style={{
                    alignSelf:
                      this.state.userName === message.user
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Meta
                    avatar={
                      <Avatar
                        style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                      >
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={message.user}
                    description={message.message}
                  />
                </Card>
              ))}
            </div>

            <div className="message-input-container">
              <Search
                placeholder="Type message here ..."
                enterButton="send"
                size="large"
                value={this.state.currentMessage}
                onChange={(e) =>
                  this.setState({ currentMessage: e.target.value })
                }
                onSearch={(value) => this.handleSendMessage(value)}
              />
            </div>
          </div>
        ) : (
          <div className="login">
            <Search
              placeholder="Enter username"
              enterButton="Login"
              size="large"
              onSearch={(value) => this.handleLogin(value)}
            />
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
