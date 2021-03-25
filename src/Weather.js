import React, { useEffect, useState } from "react";

const Weather = function Weather() {
  const [searchValue, setSearchValue] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [locationSelected, setLocationSelected] = useState("44418");
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getLocations() {
      fetch("/query?location=" + searchValue)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSearchList(data);
        });
    }
    if (searchValue.trim() != "") {
      getLocations();
    } else {
      if (searchList.length) setSearchList([]);
    }
  }, [searchValue]);

  function searchLocation() {
    if (searchActive == true)
      return (
        <div>
          <div className="">
            <input
              type="text"
              name="searchLocation"
              value={searchValue}
              placeholder="search location"
              onChange={(e) => {
                console.log(e);
                setSearchValue(e.target.value);
              }}
            />
          </div>
          <div className="locationElements">
            {searchList.map((item) => (
              <div key={item.woeid}>
                <p
                  className="searchElement"
                  onClick={() => {
                    setLocationSelected(item.woeid);
                    setSearchActive(false);
                    setSearchValue("");
                    setSearchList([]);
                  }}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
  }

  useEffect(() => {
    function getLocation(id) {
      setLoading(true);
      fetch("/location?id=" + id)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setLocationData([data]);
          setLoading(false);
        });
    }
    getLocation(locationSelected);
  }, [locationSelected]);

  function showLocationData() {
    if (loading == true) return <p>Loading...</p>;
    if (locationData.length == 0) return;
    console.log(locationData);
    return (
      <div>
        {locationData.map((item) => (
          <p key={item.woeid}>{item.title} </p>
        ))}
      </div>
    );
  }
  return (
    <div className="flex">
      <div
        className={`flex-1 search left ${searchActive == !true ? "hide" : ""} `}
      >
        {searchLocation()}
      </div>
      <div
        className={`flex-1 search left ${
          searchActive == !false ? "hide" : ""
        } `}
      >
        <div
          className="searchButton"
          onClick={() => {
            setSearchActive(true);
          }}
        >
          Search Btn
        </div>
        <div>{showLocationData()}</div>
      </div>
      <div className="flex-3 right">Hi</div>
    </div>
  );
};
export default Weather;
