//Importing all components we need
import React, { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./SearchBar";
import LogIn from "./LogIn";
import LoggedIn from "./LoggedIn";
import SearchResult from "./SearchResult";
import Playlists from "./Playlist";
import NowPlaying from "./NowPlaying";

//Data for retreaving a Token from spotify
//const clientId ="01b7b53919a14c7787b6fcfc202587da"; // your clientId
const clientId = process.env.REACT_APP_CLIENT_ID; // your clientId
const clientSecret = process.env.REACT_APP_CLIENT_SECRET; // your clientSecret
const redirectUrl = "https://m4tryxxx.github.io/jammming"; // your redirect URL - must be localhost URL and/or HTTPS
//const redirectUrl = "https://m4tryxxx.github.io/jammming/"; // your redirect URL - must be localhost URL and/or HTTPS
console.log(clientId);
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope =
  "user-read-private user-read-email playlist-modify-public playlist-modify-private user-read-playback-state user-modify-playback-state user-library-read playlist-read-private";

// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  get access_token() {
    return localStorage.getItem("access_token");
  },
  get refresh_token() {
    return localStorage.getItem("refresh_token");
  },
  get expires_in() {
    return localStorage.getItem("refresh_in");
  },
  get expires() {
    return localStorage.getItem("expires");
  },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem("expires", expiry);
  },
};

// On page load, try to fetch auth code from current browser search URL
const args = new URLSearchParams(window.location.search);
const code = args.get("code");

// If we find a code, we're in a callback, do a token exchange

if (code) {
  const token = await getToken(code);
  currentToken.save(token);

  // Remove code from URL so we can refresh correctly.
  const url = new URL(window.location.href);
  url.searchParams.delete("code");

  const updatedUrl = url.search ? url.href : url.href.replace("?", "");
  window.history.replaceState({}, document.title, updatedUrl);
}

//Adding user profile information on homepage on login
let userData;

//console.log(userData);

// Otherwise we're not logged in, so render the login template
if (!currentToken.access_token) {
}

async function redirectToSpotifyAuthorize() {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  window.localStorage.setItem("code_verifier", code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

// Soptify API Calls
async function getToken(code) {
  const code_verifier = localStorage.getItem("code_verifier");

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier,
    }),
  });

  return await response.json();
}

async function refreshToken() {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: currentToken.refresh_token,
    }),
  });

  return await response.json();
}

async function getUserData() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: "Bearer " + currentToken.access_token },
  });

  return await response.json();
}

//Adding user playlist on the homepage on login

// const [playList, setPlayList] = useState();
async function getUserPlaylists() {
  const searchParameters = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  };

  const playlistsObj = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    searchParameters
  )
    .then((response) => response.json())
    //.then(data => console.log(data))
    .then((data) => {
      return data.items;
    });

  return playlistsObj;
}

//console.log(getUserPlaylists());

async function getUserTracks() {
  const searchParameters = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  };

  const playlistsObj = await fetch(
    "https://api.spotify.com/v1/me/tracks",
    searchParameters
  )
    .then((response) => response.json())
    //.then(data => console.log(data))
    .then((data) => {
      return data;
    });

  return playlistsObj;
}

let personalTracksObj;
try {
  personalTracksObj = await getUserTracks();
} catch (error) {
  console.log(error);
}
//console.log(personalTracksObj);

async function currentlyTrack() {
  const fetchData = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  };
  const pause = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    fetchData
  ).then((response) => {
    return response.json();
  });
  return pause;
}

async function activeDevice() {
  const fetchData = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  };
  const device = await fetch(
    "https://api.spotify.com/v1/me/player/devices",
    fetchData
  ).then((response) => {
    return response.json();
  });
  return device;
}

let activeDev;
let nowPlaying;

//console.log(nowPlaying.item);
try {
  currentlyTrack().then(
    function (resolved) {
      nowPlaying = resolved;
    },
    function (error) {
      nowPlaying = "Nothing Playing . . .";
    }
  );
} catch (error) {
  console.log(error);
}
try {
  activeDevice().then(
    function (resolved) {
      activeDev = resolved;
    },
    function (error) {
      activeDev = "No device active";
    }
  );
} catch (error) {
  console.log(error);
}

async function updateNow() {
  currentlyTrack().then(
    function (resolved) {
      nowPlaying = resolved;
    },
    function (error) {
      nowPlaying = "Nothing Playing . . .";
    }
  );

  activeDevice().then(
    function (resolved) {
      activeDev = resolved;
    },
    function (error) {
      activeDev = "No device active";
    }
  );
  //console.log(nowPlaying);
}

let playList;
if (currentToken.access_token && currentToken.expires > Date()) {
  try {
    userData = await getUserData();
    playList = await getUserPlaylists();
  } catch (error) {
    console.log(error);
  }
  //console.log(playList);
  try {
    currentlyTrack().then(
      function (resolved) {
        nowPlaying = resolved;
      },
      function (error) {
        nowPlaying = "Nothing Playing . . .";
      }
    );
    //console.log(playList);
    setInterval(updateNow, 3000);
  } catch (error) {
    console.log(error);
  }
}

//Main app

function App() {
  // eslint-disable-next-line
  const [mura, setMura] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setMura((count) => count + 1);
    }, 2000);
  });

  //Fetch Playlist Tracks
  const [playlistContent, setPlaylistContent] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState({
    name: "",
    id: "",
    snapshot_id: "",
  });

  async function getPlaylistTracks(playlistId) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
    };

    const playlistItems = await fetch(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.items;
      });
    setPlaylistContent(await playlistItems);
    //console.log(playlistContent);
  }

  //Fetch Albums From Search
  const [albumObj, setAlbumObj] = useState(false);
  async function getAlbumResult(item) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
    };
    const artistId = await fetch(
      "https://api.spotify.com/v1/search?q=" + item + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });
    //.then(data => {return data.artist.items[0].id});
    //console.log(`Artist ID is: ${artistId}`);
    const albums = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album`,
      searchParameters
    );
    setAlbumObj(await albums.json());
    //console.log(await albums.json());
  }

  //Fetch Tracks from search

  const [trackObj, setTrackObj] = useState(false);
  async function getTrackResult(item) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
    };
    const tracks = await fetch(
      "https://api.spotify.com/v1/search?q=" + item + "&type=track&limit=50",
      searchParameters
    );
    setTrackObj(await tracks.json());
    //console.log(trackObj);
  }

  useEffect(() => {
    //console.log(trackObj);
  }, [trackObj]);

  async function getNextTrackResult(next) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
    };
    //console.log(next);
    const tracks = await fetch(next, searchParameters);
    setTrackObj(await tracks.json());
    //console.log(trackObj);
  }

  async function getNextAlbumResult(next) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
    };
    //console.log(next);
    const tracks = await fetch(next, searchParameters);
    setAlbumObj(await tracks.json());
    //console.log(trackObj);
  }

  const [personalTracks, setPersonalTracks] = useState(personalTracksObj);
  async function getNextLiked(next) {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
    };
    //console.log(next);
    const tracks = await fetch(next, searchParameters);
    setPersonalTracks(await tracks.json());
    //console.log(personalTracks);
  }

  const [updatePlaylist, setUpdatePlaylist] = useState(playList);
  const [newPlName, setNewPlName] = useState("");
  function handleNewPlaylistName(e) {
    setNewPlName(e.target.value);
  }
  //Create a new spotify playlist
  async function createPlaylist() {
    const requestData = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + currentToken.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newPlName,
        description: "Created on Jammer!",
        public: "true",
      }),
    };
    await fetch(
      "https://api.spotify.com/v1/users/" + userData.id + "/playlists",
      requestData
    ).then((response) => console.log(response.json()));
    setUpdatePlaylist(await getUserPlaylists());
  }

  // Event handlers

  //console.log("Control: ",test);
  async function handleNewPlaylist() {
    //console.log(newPlName);
    if (newPlName !== "") {
      createPlaylist();
      playList = await getUserPlaylists();
    } else {
      alert("Please enter a valid name!");
    }
  }

  async function handleLoginWithSpotifyClick() {
    await redirectToSpotifyAuthorize();
  }

  async function handleLogoutClick() {
    localStorage.clear();
    window.location.href = redirectUrl;
  }

  async function handleRefreshTokenClick() {
    const token = await refreshToken();
    currentToken.save(token);
    //renderTemplate("oauth", "oauth-template", currentToken);
  }

  const [searchInput, setSearchInput] = useState("");

  function handleSearch(e) {
    setSearchInput(e.target.value);
  }

  function handleSearchTrackSubmit() {
    if (searchInput !== "") {
      getTrackResult(searchInput);
      setAlbumObj(false);
      setPlaylistContent(false);
      //console.log(trackObj);
    } else {
      // setPlaylistContent(false);
      // setAlbumObj(false);
      alert("Search form empty, try again!");
    }
  }

  function handleSearchAlbumSubmit() {
    if (searchInput !== "") {
      getAlbumResult(searchInput);
      setTrackObj(false);
      setPlaylistContent(false);
      //console.log(albumObj);
    } else {
      // setTrackObj(false);
      // setPlaylistContent(false);

      alert("Search form empty, try again!");
    }
  }

  function handleNextPage() {
    if (trackObj) {
      if (trackObj.tracks.next !== null) {
        getNextTrackResult(trackObj.tracks.next);
        setAlbumObj(false);
        setPlaylistContent(false);
        //   if(prevPage.length > 1)
        //   //console.log(prevPage[prevPage.lenght - 2]);
        // }
        //console.log(trackObj);
        //console.log(prevPage.length);
      }
    } else if (albumObj) {
      if (albumObj.next !== null) {
        getNextAlbumResult(albumObj.next);
        setTrackObj(false);
        setPlaylistContent(false);
        //   if(prevPage.length > 1)
        //   //console.log(prevPage[prevPage.lenght - 2]);
        // }
        //console.log(trackObj);
        //console.log(prevPage.length);
      }
    }
  }

  function handleNextLiked() {
    if (personalTracks.next !== null) {
      getNextLiked(personalTracks.next);
    }
  }

  function handlePrevPage() {
    if (trackObj) {
      if (trackObj.tracks.previous !== null) {
        getNextTrackResult(trackObj.tracks.previous);
        setAlbumObj(false);
        setPlaylistContent(false);
        //console.log(trackObj);
      }
    } else if (albumObj) {
      //console.log(prevPage.length);
      if (albumObj.previous !== null) {
        // prevPage.pop();
        getNextAlbumResult(albumObj.previous);
        setTrackObj(false);
        setPlaylistContent(false);
      }
    }
  }

  function handlePrevLiked() {
    if (personalTracks.previous !== null) {
      getNextLiked(personalTracks.previous);
      //console.log(personalTracks);
    }
  }

  async function handlePlaylistContent(e) {
    //console.log(e.target.className);
    setTrackObj(false);
    setAlbumObj(false);
    await getPlaylistTracks(e.target.id);

    // setPlaylistContent(`Playlist ID:  ${e.target.id}   -   Playlist Name:  ${e.target.name}.`);
    setSelectedPlaylist({
      name: e.target.name,
      id: e.target.id,
      snapshot_id: e.target.className,
    });
    //console.log(playlistContent);
    //console.log(
    // "The snapshoot of playlist should be: " + selectedPlaylist.snapshot_id
    //);
    //console.log(selectedPlaylist.snapshot_id);
  }
  let duplicateCheck = [];
  async function handleAddToPlaylist(e) {
    //console.log(e.target.id);
    //console.log(selectedPlaylist);
    //trackUri = e.target.id;
    if (
      e.target.id !== null &&
      e.target.id !== undefined &&
      e.target.id !== ""
    ) {
      console.log("This is Target propreties", e.target);
      let responseAddToPlaylist;
      const sendParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentToken.access_token,
        },
        body: JSON.stringify({ uris: [e.target.id], position: 0 }),
      };
      await fetch(
        "https://api.spotify.com/v1/playlists/" +
          selectedPlaylist.id +
          "/tracks",
        sendParameters
      ).then((response) => (responseAddToPlaylist = response.status));
      console.log(
        `Response status of request to add spotify item with uri: ${e.target.id} is ${responseAddToPlaylist}!`
      );
      if (responseAddToPlaylist === 200) {
        document.getElementById(e.target.id).innerHTML = "Added!";
        document.getElementById(e.target.id).style =
          "background-color: darkgreen";
      } else {
        document.getElementById(e.target.id).style = "background-color: salmon";
        e.target.innerHTML = "Try again!";
      }
    } else {
      console.log("Failed to add the item!");
    }
  }

  async function handleRemFromPlaylist(e) {
    console.log(e.target.id);
    if (
      e.target.id !== null &&
      e.target.id !== undefined &&
      e.target.id !== ""
    ) {
      //console.log(selectedPlaylist);
      //console.log("Snapshot of playlist is: " + selectedPlaylist.id);

      const sendParameters = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentToken.access_token,
        },
        body: JSON.stringify({
          tracks: [{ uri: e.target.id }],
          snapshot_id: selectedPlaylist.snapshot_id,
        }),
      };
      const responseRemove = await fetch(
        "https://api.spotify.com/v1/playlists/" +
          selectedPlaylist.id +
          "/tracks",
        sendParameters
      ).then((response) => {
        return response.status;
      });
      //console.log(`Response status of request to delete spotify item with uri: ${remUri} is ${responseRemove}!`);
      if (responseRemove === 200) {
        document.getElementById(e.target.id).innerHTML = "Removed";
        document.getElementById(e.target.id).style = "background-color: salmon";
      } else {
        e.target.innerHTML = "Try again!";
        document.getElementById(e.target.id).style = "background-color: red";
      }
    } else {
      console.log("Failed to remove the item");
    }
  }

  const [newPlaylistName, setNewPlaylistName] = useState("");
  function handlePlaylistNameChange(e) {
    setNewPlaylistName(e.target.value);
    //console.log(newPlaylistName);
  }

  let responseChangePlaylistName;
  async function handlePlaylistName() {
    //console.log(e.target.id);
    //console.log(selectedPlaylist);

    const sendParameters = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentToken.access_token,
      },
      body: JSON.stringify({ name: newPlaylistName }),
    };
    await fetch(
      "https://api.spotify.com/v1/playlists/" + selectedPlaylist.id,
      sendParameters
    ).then((response) => (responseChangePlaylistName = response.status));
    playList = await getUserPlaylists();

    if (responseChangePlaylistName === 200) {
      document.getElementById("submitName").innerHTML = "Succefully Changed!";
      document.getElementById("submitName").style =
        "background-color: darkgreen";
    } else {
      document.getElementById("submitName").innerHTML = "Try Again";
      document.getElementById("submitName").style = "background-color: salmon";
    }
  }

  //console.log(currentToken.access_token);

  if (code && currentToken.access_token && currentToken.expires > Date()) {
    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");

    const updatedUrl = url.search ? url.href : url.href.replace("?", "");
    window.history.replaceState({}, document.title, updatedUrl);
    //const avatar = userData.images[0];
    //console.log(avatar);
    //console.log(getSearchResult('romaneasca'));
    return (
      <>
        <div id="header-container">
          <LoggedIn
            onLogOutClick={handleLogoutClick}
            onRefreshTokenClick={handleRefreshTokenClick}
            userReturn={userData}
          />
          <NowPlaying
            currentDev={activeDev}
            active={nowPlaying}
            update={updateNow}
          />
          <SearchBar
            onChange={handleSearch}
            onSubmitTracks={handleSearchTrackSubmit}
            onSubmitAlbums={handleSearchAlbumSubmit}
          />
        </div>
        <br />
        <div className="mainContent">
          <Playlists
            getPlaylists={updatePlaylist}
            getPTracks={getPlaylistTracks}
            handleClick={handlePlaylistContent}
            activePlaylist={selectedPlaylist}
            handleNameChange={handlePlaylistNameChange}
            handlePlaylistName={handlePlaylistName}
            responseNameChange={responseChangePlaylistName}
            handleChange={handleNewPlaylistName}
            handleCreatePlaylist={handleNewPlaylist}
            duplicate={duplicateCheck}
          />
          <SearchResult
            tracksResult={trackObj}
            albumResult={albumObj}
            playlistSongs={playlistContent}
            activePlaylist={selectedPlaylist}
            handleClick={handleAddToPlaylist}
            handleAddToPlaylist={handleAddToPlaylist}
            handleRemoveItem={handleRemFromPlaylist}
            token={currentToken.access_token}
            handleNextPage={handleNextPage}
            handlePrev={handlePrevPage}
            liked={personalTracks}
            handleNextL={handleNextLiked}
            handlePrevL={handlePrevLiked}
            activePl={selectedPlaylist}
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <LogIn handleClick={handleLoginWithSpotifyClick} />
      </>
    );
  }
}

export default App;
