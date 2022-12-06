import React, { useState } from "react";
import RestaurantsView from "../RestaurantsView/RestaurantsView";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Container } from "react-bootstrap";

import "./Restaurant.css";

function Restaurant() {
  const [zipCode, setzipCode] = useState(11111);

  const handleSelect = (e) => {
    console.log("this is a target", e);
    setzipCode(e);
  };

  return (
    <div className="box">
      <Container>
        <h1 className="title">Local Restaurants</h1>
        <div className="zipDropDown">
          <DropdownButton
            id="button"
            alignRight
            title="Please select a Zipcode"
            onSelect={handleSelect}
          >
            <Dropdown.Item eventKey={11111}>11111</Dropdown.Item>
            <Dropdown.Item eventKey={88888}>88888</Dropdown.Item>
            <Dropdown.Item eventKey={99999}>99999</Dropdown.Item>
          </DropdownButton>
          <h4 className="title">You selected {zipCode}</h4>

          {zipCode == 11111 && (
            <RestaurantsView mode="byZipcode" searchTerm={11111} />
          )}
          {zipCode == 88888 && (
            <RestaurantsView mode="byZipcode" searchTerm={88888} />
          )}
          {zipCode == 99999 && (
            <RestaurantsView mode="byZipcode" searchTerm={99999} />
          )}
        </div>
      </Container>
    </div>
  );
}

export default Restaurant;
