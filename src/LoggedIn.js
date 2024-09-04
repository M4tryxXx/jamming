import React from "react";

function LoggedIn(props) {
  //console.log(props.userReturn);
  const avatarUrl = props.userReturn.images[0].url;
  const avatarWidth = props.userReturn.images[0].width;
  const avatarHeight = props.userReturn.images[0].height;
  const email = props.userReturn.email;
  const userId = props.userReturn.id;
  const name = props.userReturn.display_name;

  return (
    <header>
      <div className="profileDiv">
        <img
          src={avatarUrl}
          width={avatarWidth}
          height={avatarHeight}
          alt="Avatar"
          id="profileImg"
        />
        <div id="profileDetails">
          <p>
            Welcome back <strong>{name}</strong>
            <br />
            <strong>Email:&nbsp;</strong> <a href="mailto:{email}">{email}</a>{" "}
            <br />
            <strong>Id:&nbsp;</strong>
            {userId}
          </p>
          <button id="refresh-token-button" onClick={props.onRefreshTokenClick}>
            Refresh Token
          </button>
          <button id="logout-button" onClick={props.onLogOutClick}>
            Log out
          </button>
        </div>
      </div>
      <h1>Jammming</h1>
    </header>
  );
}

export default LoggedIn;
