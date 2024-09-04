import React, { useState, useEffect } from "react";
let toCompareWith = [];
let duplicate = [];

function SearchResult(props) {
  const [receivedAlbums, setReceivedAlbums] = useState(props.albumResult);
  const [receivedTracks, setReceivedTracks] = useState(props.tracksResult);
  const [receivedTracksFromPlaylist, setReceivedTracksFromPlaylist] = useState(
    props.playlistSongs
  );
  const [likedTracks, setLikedTracks] = useState(props.liked);
  //const[albums, setAlbums] = useState();
  let trackList = [];
  let albumList = [];
  let likedArray = [];
  let artists = [];
  let remaining;

  //console.log('Liked Tracks: ' , likedTracks)
  useEffect(() => {
    const receivedTracksId = setReceivedTracks(props.tracksResult);
    return () => {
      clearInterval(receivedTracksId);
    };
  }, [props.tracksResult]);

  useEffect(() => {
    const receivedAlbumsId = setReceivedAlbums(props.albumResult);
    return () => {
      clearInterval(receivedAlbumsId);
    };
  }, [props.albumResult]);

  useEffect(() => {
    const receivedPlaylistTracksId = setReceivedTracksFromPlaylist(
      props.playlistSongs
    );
    return () => {
      clearInterval(receivedPlaylistTracksId);
    };
  }, [props.playlistSongs]);

  useEffect(() => {
    const receivedLikedId = setLikedTracks(props.liked);
    return () => {
      clearInterval(receivedLikedId);
    };
  }, [props.liked]);

  let uri;

  if (receivedTracks) {
    //console.log(receivedTracks.tracks.items[0]);

    for (let i = 0; i < receivedTracks.tracks.items.length; i++) {
      uri = receivedTracks.tracks.items[i].uri;
      if (!duplicate.includes(uri)) {
        duplicate.push(uri);
      }
      if (!toCompareWith.includes(uri)) {
        //console.log(duplicate);
        //console.log(receivedTracks.tracks.items[i].uri)
        for (
          let j = 0;
          j < receivedTracks.tracks.items[i].artists.length;
          j++
        ) {
          artists.push(receivedTracks.tracks.items[i].artists[j].name);
          //console.log(receivedTracks.tracks.items[i].artists[j].name);
        }

        trackList.push(
          <div
            key={receivedTracks.tracks.items[i].id}
            className="trackContainer"
          >
            <div className="albumImgDiv">
              <img
                className="albumImg"
                src={receivedTracks.tracks.items[i].album.images[0].url}
                alt={"Image of " + receivedTracks.tracks.items[i].name}
              />
            </div>
            <p className="track" id={receivedTracks.tracks.items[i].id}>
              <strong>{receivedTracks.tracks.items[i].name}</strong> -{" "}
              {artists.join(" & ")} <br />{" "}
              <span className="albumTitle">
                <strong>{receivedTracks.tracks.items[i].album.name}</strong>
              </span>
            </p>
            <div className="btnDiv">
              {" "}
              <button
                key={100 + i}
                className="trackBtn"
                id={uri}
                onClick={props.handleAddToPlaylist}
              >
                Add to <br />
                <strong>{props.activePlaylist.name}</strong>
              </button>
            </div>
          </div>
        );
        artists = [];
        uri = "";
      } else {
        for (
          let j = 0;
          j < receivedTracks.tracks.items[i].artists.length;
          j++
        ) {
          artists.push(receivedTracks.tracks.items[i].artists[j].name);
          //console.log(receivedTracks.tracks.items[i].artists[j].name);
        }
        trackList.push(
          <div
            key={receivedTracks.tracks.items[i].id}
            className="trackContainer"
          >
            <div className="albumImgDiv">
              <img
                className="albumImg"
                src={receivedTracks.tracks.items[i].album.images[0].url}
                alt={"Image of " + receivedTracks.tracks.items[i].name}
              />
            </div>
            <p className="track" id={receivedTracks.tracks.items[i].id}>
              <strong>{receivedTracks.tracks.items[i].name}</strong> -{" "}
              {artists.join(" & ")} <br />{" "}
              <span className="albumTitle">
                <strong>{receivedTracks.tracks.items[i].album.name}</strong>
              </span>
            </p>
            <div className="btnDiv">
              {" "}
              <button
                key={100 + i}
                className="trackBtn"
                id={uri}
                style={{ backgroundColor: "darkgreen", cursor: "not-allowed" }}
              >
                Already In <br />
                <strong>{props.activePlaylist.name}</strong>
              </button>
            </div>
          </div>
        );
        artists = [];
        uri = "";
      }
    }

    //console.log('This are the tracks from search: ', duplicate);
    //console.log('This are the tracks from playlist: ', toCompareWith);

    return (
      <div id="resultedTrackList">
        <span id="back"></span>
        <div id="top">
          <br />
          <br />
          <h4>Found: {receivedTracks.tracks.total} Tracks</h4>
          <h5>Showing: {receivedTracks.tracks.items.length} results/page!</h5>
          <hr />
        </div>
        <br />
        {trackList}
        <br />
        <div className="pages">
          <a href="#back" onClick={props.handlePrev}>
            <button className="trackBtn">&lt;&lt;</button>
          </a>{" "}
          <a href="#back" onClick={props.handleNextPage}>
            <button className="trackBtn">&gt;&gt;</button>
          </a>
        </div>
      </div>
    );
  } else if (receivedAlbums) {
    //console.log(receivedAlbums);

    for (let i = 0; i < receivedAlbums.items.length; i++) {
      for (let j = 0; j < receivedAlbums.items[i].artists.length; j++) {
        artists.push(receivedAlbums.items[i].artists[j].name);
        //console.log(receivedAlbums.items[i].artists[j].name);
      }
      albumList.push(
        <div key={receivedAlbums.items[i].id} className="trackContainer">
          <img
            src={receivedAlbums.items[i].images[0].url}
            alt={"Album art of " + receivedAlbums.items[i].name}
          />
          <p className="track" id={receivedAlbums.items[i].id}>
            <strong>{receivedAlbums.items[i].name}</strong>
            <br /> {artists.join(" & ")} <br />{" "}
          </p>
        </div>
      );
      artists = [];
    }

    return (
      <div id="resultedTrackList">
        <h4>Showing: {receivedAlbums.items.length} results/page!</h4>
        <br />
        <hr />
        <br />
        {albumList}
        <div className="pages">
          <a href="#back" onClick={props.handlePrev}>
            <button className="trackBtn">&lt;&lt;</button>
          </a>{" "}
          <a href="#back" onClick={props.handleNextPage}>
            <button className="trackBtn">&gt;&gt;</button>
          </a>
        </div>
      </div>
    );
  } else if (receivedTracksFromPlaylist) {
    //console.log(receivedTracksFromPlaylist);
    toCompareWith = [];

    for (let i = 0; i < receivedTracksFromPlaylist.length; i++) {
      if (!toCompareWith.includes(receivedTracksFromPlaylist[i].track.uri)) {
        toCompareWith.push(receivedTracksFromPlaylist[i].track.uri);
      }

      let image;
      if (
        receivedTracksFromPlaylist[i].track.album.images[0].url !== null ||
        receivedTracksFromPlaylist[i].track.album.images[0].url !== undefined
      ) {
        image = receivedTracksFromPlaylist[i].track.album.images[0].url;
      } else {
        image = "images/no-image.jpg";
      }
      for (
        let j = 0;
        j < receivedTracksFromPlaylist[i].track.artists.length;
        j++
      ) {
        artists.push(receivedTracksFromPlaylist[i].track.artists[j].name);
        //console.log(receivedTracks.tracks.items[i].artists[j].name);
      }
      albumList.push(
        <div
          key={receivedTracksFromPlaylist[i].track.id}
          className="trackContainer"
        >
          <div className="albumImgDiv">
            <img
              src={image}
              alt={"Image of " + receivedTracksFromPlaylist[i].track.name}
            />
          </div>
          <p className="track" id={receivedTracksFromPlaylist[i].track.id}>
            <strong>{receivedTracksFromPlaylist[i].track.name}</strong> -{" "}
            {artists.join(" & ")} <br />{" "}
            <span className="albumTitle">
              <strong>{receivedTracksFromPlaylist[i].track.album.name}</strong>
            </span>
          </p>
          <div className="btnDiv">
            <button
              key={200 + i}
              className="trackBtn"
              id={receivedTracksFromPlaylist[i].track.uri}
              onClick={props.handleRemoveItem}
            >
              Remove from <br />
              <strong>{props.activePlaylist.name}</strong>
            </button>
          </div>
        </div>
      );
      artists = [];
    }

    duplicate = [];

    //console.log(toCompareWith)

    return (
      <div id="resultedTrackList">
        <h4>Selected playlist: <br />{props.activePl.name}</h4>
        <h4>Showing: {receivedTracksFromPlaylist.length} results/page!</h4>
        <hr />
        <br />
        {albumList}
      </div>
    );
  } else {
    //console.log(receivedAlbums);
    remaining = props.liked.total - props.liked.offset;

    for (let i = 0; i < likedTracks.items.length; i++) {
      for (let j = 0; j < likedTracks.items[i].track.artists.length; j++) {
        artists.push(likedTracks.items[i].track.artists[j].name);
        //console.log(receivedAlbums.items[i].artists[j].name);
      }
      likedArray.push(
        <div key={likedTracks.items[i].track.id} className="trackContainer">
          <img
            src={likedTracks.items[i].track.album.images[0].url}
            alt={"Album art of " + likedTracks.items[i].track.name}
          />
          <p className="track" id={likedTracks.items[i].track.id}>
            <strong>{likedTracks.items[i].track.name}</strong>
            <br /> {artists.join(" & ")} <br />{" "}
          </p>
        </div>
      );
      artists = [];
    }

    return (
      <div id="resultedTrackList">
        <span id="back"></span>
        <h4>Liked Songs: {likedTracks.total} Tracks</h4>
        <h5>
          Showing: {likedTracks.items.length} results/page, {remaining} more!{" "}
        </h5>
        <br />
        <hr />
        <br />
        {likedArray}
        <div className="pages">
          <a href="#back">
            <button onClick={props.handlePrevL} className="trackBtn">
              &lt;&lt;
            </button>
          </a>{" "}
          <a href="#back">
            <button onClick={props.handleNextL} className="trackBtn">
              &gt;&gt;
            </button>
          </a>
        </div>
      </div>
    );
  }
}

export default SearchResult;
