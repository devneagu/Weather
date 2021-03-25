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

  function cancelSearch() {
    console.log("hi");
    setSearchActive(false);
  }
  useEffect(() => {
    if (searchActive) document.querySelector(".inputSearch").focus();
  }, [searchActive]);
  function searchLocation() {
    if (searchActive == true)
      return (
        <div>
          <div className="searchContainer">
            <div className="flex">
              <input
                type="text"
                className="inputSearch"
                name="searchLocation"
                autoComplete="off"
                value={searchValue}
                placeholder="search location"
                onChange={(e) => {
                  console.log(e);
                  setSearchValue(e.target.value);
                }}
              />
              <span className="cancelSearch" onClick={() => cancelSearch()}>
                &#10005;
              </span>
            </div>
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

  function checkIndex(item, index) {
    let day = "";
    if (index == 0) return;
    index == 1
      ? (day = "Tomorrow")
      : (day = new Date(item.applicable_date)
          .toDateString()
          .replace(" " + new Date().getFullYear(), ""));
    return (
      <div key={item.id} className="boxDays">
        <div className="boxDay">
          <p className="date">{day}</p>
          <p className="weatherStateBox">{item.weather_state_name}</p>
          <div className="weatherTemp">
            <span className="maxTemp">{parseInt(item.max_temp)}&#8451;</span> -{" "}
            <span className="minTemp">{parseInt(item.min_temp)}&#8451;</span>
          </div>
        </div>
      </div>
    );
  }
  function showFollowingDates() {
    if (loading == true) return <p>Loading...</p>;
    if (locationData.length == 0) return;
    console.log(locationData[0].consolidated_weather);
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
        {locationData[0].consolidated_weather.map((item, index) =>
          checkIndex(item, index)
        )}
      </div>
    );
  }
  function showLocationData() {
    if (loading == true) return <p>Loading...</p>;
    if (locationData.length == 0) return;
    console.log(locationData);
    return (
      <div>
        {locationData.map((item) => (
          <div key={item.woeid} className="todayView">
            <div className="weatherImage"></div>
            <div className="temperature">
              <p>
                {parseInt(item.consolidated_weather[0].the_temp)}
                <span>&#8451;</span>
              </p>
            </div>
            <div className="todayFooter">
              <p className="weatherState">
                {item.consolidated_weather[0].weather_state_name}
              </p>
              <p>
                Today -
                {new Date(
                  item.consolidated_weather[0].applicable_date
                ).toDateString()}
              </p>
              <p key={item.woeid}>{item.title} </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function todayHighlights() {
    if (loading == true) return <p>Loading...</p>;
    if (locationData.length == 0) return;
    return (
      <div>
        {locationData.map((item) => (
          <div
            key={item.woeid}
            className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 items-center "
          >
            <div className="highlightBox">
              <div className="marginReset">
                <p className="title">Wind status</p>
                <p>{parseInt(item.consolidated_weather[0].wind_speed)} mph</p>
                <p className="title">
                  {item.consolidated_weather[0].wind_direction_compass}
                </p>
              </div>
            </div>
            <div className="highlightBox">
              <div className="marginReset">
                <p className="title">Humidity</p>
                <p>{parseInt(item.consolidated_weather[0].humidity)}%</p>
              </div>
            </div>
            <div className="highlightBox">
              <div className="marginReset">
                <p className="title">Visibility</p>
                <p>{parseInt(item.consolidated_weather[0].visibility)} miles</p>
              </div>
            </div>
            <div className="highlightBox">
              <div className="marginReset">
                <p className="title">Air Pressure</p>
                <p>{parseInt(item.consolidated_weather[0].air_pressure)} mb</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      // winnd status , {item}, wind direction {WSW}
      // humidity , {}, slider (0 la 100%)
      // Visibility, {} miles
      //Air pressure,  {}mb
    );
  }
  return (
    <div className="flex flex-wrap ">
      <div
        className={`w-full md:w-2/5  search left ${
          searchActive == !true ? "hide" : ""
        } `}
      >
        {searchLocation()}
      </div>
      <div
        className={`w-full md:w-2/5 search left ${
          searchActive == !false ? "hide" : ""
        } `}
      >
        <div
          className="searchButton"
          onClick={() => {
            setSearchActive(true);
          }}
        >
          Search location
        </div>
        <div>{showLocationData()}</div>
      </div>
      <div className="w-full  md:w-3/5 right">
        <div className="container mx-auto px-20 rightContainer">
          <div className="followingDatesContainer">{showFollowingDates()}</div>
          <h1>Today's highlights</h1>
          <div className="highlights">{todayHighlights()}</div>
        </div>
      </div>
    </div>
  );
};
export default Weather;
