import React from "react";

function LogIn(props) {
  return (
    <>
      <div id="login">
        <h1>Welcome to Jammming</h1>
        <br />
        <br />
        <h3>Please log in with Spotify account to continue </h3>
        <p>
          Please Note: <br />
          All content displayed on this app is Provided by Spotify.
          <br /> No personal data is stored or manipulated in any way by this
          app.
          <br /> Please read and accept{" "}
          <a href="https://www.spotify.com/uk/legal/end-user-agreement/">
            <strong
              style={{
                color: "skyblue",
                fontWeight: "bold",
                textShadow: "none",
                fontSize: "25px",
              }}
            >
              Spotify Terms of Use
            </strong>
          </a>{" "}
          for more details
        </p>
        <button
          id="login-button"
          onClick={props.handleClick}
          //onTouchStart={props.handleClick}
        >
          {" "}
          Log in{" "}
        </button>
      </div>
    </>
  );
}

export default LogIn;
