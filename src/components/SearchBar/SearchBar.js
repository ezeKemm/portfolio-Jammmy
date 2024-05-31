import React, { useState, useCallback } from "react";

const SearchBar = (props) => {
  // stores the value of our query in react state of the component
  const [term, setTerm] = useState("");
  // on updating the input field (adding/changing the query), the query stored in state must be updated

  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);

  // execute a search with the Spotify search method passed thru props
  const search = useCallback(() => {
    props.onSearch(term);
  }, [props.onSearch, term]);

  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Search Jammy"
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
