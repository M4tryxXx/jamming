import React, { useState } from "react";

function SearchBar(props) {
  return (
    <div id="searchBar">
      <input
        type="text"
        className="search"
        id="search"
        onChange={props.onChange}
        name="search"
        placeholder="Search . . ."
      />
      <br />
      <input
        type="submit"
        id="searchBtn-tracks"
        value="Tracks"
        onClick={props.onSubmitTracks}
      />
      <input
        type="submit"
        id="searchBtn-albums"
        value="Albums"
        onClick={props.onSubmitAlbums}
      />
    </div>
  );
}

export default SearchBar;
