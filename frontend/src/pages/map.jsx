import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Button } from "react-bootstrap";
import { Icon } from "leaflet";
import { toast } from "react-toastify";
import { setPosition } from "../stateManagment/reducer/loginReducer";
import { useNavigate } from "react-router-dom";

export const Map = (props) => {
  const navigate = useNavigate();

  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(null);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3177/3177361.png",
    iconSize: [30, 30],
  });

  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        console.log("found");
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
      locationerror() {
        toast.warning("we could not find your location please select it");
      },
      click(e) {
        if (
          !e.originalEvent.target.classList.contains("address-detail") &&
          !e.originalEvent.target.classList.contains("hh3") &&
          !e.originalEvent.target.classList.contains("div") &&
          !e.originalEvent.target.classList.contains("confirm") &&
          !e.originalEvent.target.classList.contains("ssss") &&
          !e.originalEvent.target.classList.contains("map-input-box")
        ) {
          console.log(e.originalEvent.target);
          setPosition(e.latlng);
        }
      },
    });
    return position === null ? null : (
      <Marker position={position} icon={customIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  const searchHandler = async (query) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query.target.value}&format=json&addressdetails=10&limit=5`
    );
    const data = await response.json();
    setAddress(data);
  };

  function SearchDetails() {
    const map = useMapEvents({});

    function handleSelect(data) {
      const newPosition = { lat: data.lat, lng: data.lon };
      setPosition(newPosition);
      map.flyTo(newPosition);
      setAddress("");
    }
    return (
      <>
        {address &&
          address.map((data, index) => (
            <div
              key={index}
              className="address-detail"
              onClick={() => handleSelect(data)}
            >
              <h3 className="hh3">{data.display_name.split(",")[0]}</h3>
              <div className="div">{data.display_name}</div>
            </div>
          ))}
      </>
    );
  }

  const handleSubmit = () => {
    props.setPosition(position);
    console.log(props.shippingData);
    navigate("/shipping");
  };

  return (
    <div className="map-container-custom">
      <MapContainer
        center={[35.6892, 51.389]}
        zoom={10}
        style={{ height: "500px" }}
        whenReady={(map) => {
          map.target.locate();
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <div className="map-wraper">
          <div className="map-input-box">
            <input
              type="text"
              placeholder="Enter your address"
              className="ssss"
              onChange={searchHandler}
            ></input>
            <Button className="confirm" type="button" onClick={handleSubmit}>
              Confirm
            </Button>
          </div>
          <SearchDetails />
        </div>
      </MapContainer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    shippingData: state.userSlice.shippingData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPosition: (position) => dispatch(setPosition({ position })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
