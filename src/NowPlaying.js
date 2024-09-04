import React, { useState, useEffect } from "react";

let artistsArray = [];


export default function NowPlaying(props) {

  const [playing, setPlaying] = useState(props.active);

  useEffect(() => {
    const playingId = setPlaying(props.active);
    return () => {
      clearInterval(playingId);
    };
  }, [props.active]);
  
  let artists = [];
let device = [];
  
  if(props.active !== 'Nothing Playing . . .' && playing.item !== undefined && playing !== undefined) { 
    
    artistsArray = props.active.item.artists;
  let isTrue = props.active.is_playing;

  if (isTrue) {
    let divPercent = Math.floor(100 * props.active.progress_ms / props.active.item.duration_ms);

    for (let j = 0; j < artistsArray.length; j++) {
      artists.push(artistsArray[j].name);
      //console.log(playing.artists[j].name);
    }
    //console.log('Tota duration: ' + props.active.item.duration_ms);
    //console.log(divPercent);
    for(let i = 0; i < props.currentDev.devices.length; i++) {
      if (props.currentDev.devices[i].is_active === true) {
        device.push(props.currentDev.devices[i]);
      }
    }
    return (
      <div className="nowPlaying">
        <div className="nowContainer">
          <h3>Now Playing on: <span style={{color: 'lime'}}>{device[0].name}</span>...</h3>
          <div className="albumImgDiv">
            <img
              style={{ height: "180px", width: "180px" }}
              className="albumImg"
              src={playing.item.album.images[1].url}
              alt={"Image of " + playing.name}
            />
          </div>
          <h2 className="track" id={playing.id}>
            <strong style={{ color: "lime" }}>{playing.item.name}</strong> <br />{" "}
            <span className="albumTitle">
              {artists.join(" & ")} - <strong>{playing.item.album.name}</strong>
            </span>
          </h2>
          <div className="progress">
            <div className="m4-green" style={{width: `${divPercent}%`}}></div>
          </div>
          <br/>
        </div>
      </div>
    );
  } else {
    return (
      <div className="nowPlaying">
        <h2 className="albumTitle">Nothing Playing . . .</h2>
      </div>
    );
  }
} else if(props.active === 'Nothing Playing . . .'){ 
  return (
  <div className="nowPlaying">
    <h2 className="albumTitle">{props.active}</h2>
  </div>
);
}  

}
