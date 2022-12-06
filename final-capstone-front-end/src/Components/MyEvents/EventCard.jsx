import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import Countdown from "react-countdown";
import { useNavigate } from "react-router";
import { baseUrl } from "../../Shared/baseUrl";
import { useUser } from "../UserProvider/UserProvider";

export default function EventCard(props) {
  const variant = props.variant === undefined ? "light" : props.variant;
  const [restLeader, setRestLeader] = useState({
    restaurantId: 15,
    pictureUrl:
      "https://images.pexels.com/photos/11783315/pexels-photo-11783315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    logo: "https://i.ibb.co/6mmxsvy/Final-Capstone-Go-Pho-Logo.png",
    restaurantName: "Go Pho",
    restaurantGenre: "🍜",
    restaurantAddress: "7984 Central Avenue",
    zipCode: 11111,
    openTime: "11:00:00",
    closeTime: "22:00:00",
    priceRange: 2,
    hasNumber: false,
  });
  const { event } = props;
  const isFinalChoiceMade = event.finalChoiceId !== 0;
  const isDecisionDatePassed = new Date() > new Date(event.decisionDateTime);
  const navigateTo = useNavigate();
  const currentUser = useUser();

  useEffect(() => {
    /* Effects */
    (async () => {
      await fetchRestaurantInfo();
    })();

    return () => {
      /* Effect clean up*/
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRestaurantInfo() {
    const fetchUrl = `${baseUrl}/restaurant/ranked/${event.eventId}`;
    const authConfig = {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    };
    let newRestLeader = {};
    try {
      const fetchedRests = await axios.get(fetchUrl, authConfig);
      if (!isFinalChoiceMade) {
        console.log(
          `!isFinalChoiceMade; setting newRestLeader to fetchedRests.data[0]`,
          fetchedRests.data[0]
        );
        newRestLeader = fetchedRests.data[0];
      } else {
        console.log(
          `isFinalChoiceMade; setting newRestLeader to fetchedRests.filter for finalChoiceId`,
          fetchedRests
        );
        newRestLeader = fetchedRests.data.filter(
          (rest) => rest.restaurantId === event.finalChoiceId
        )[0];
      }
      if (newRestLeader !== null && newRestLeader !== undefined) {
        setRestLeader(newRestLeader);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Card
        className="eventCard p-0 text-start"
        style={{ width: "18rem" }}
        bg={variant}
        text={variant === "dark" ? "light" : "dark"}
        as="button"
        onClick={() => navigateTo(`/eventView/${event.eventId}`)}
      >
        <Card.Img
          className="eventCard--img"
          variant="top"
          src={restLeader.logo}
        />
        <Card.Body>
          <Card.ImgOverlay className="eventCard--overlay">
            <Card.Title className="eventCard--title d-flex justify-content-between">
              <StyledBadge>
                {event.eventName}
                <br />
              </StyledBadge>
              <StyledBadge className="eventCard--votingBadge">
                {renderVotingIcon()}
              </StyledBadge>
            </Card.Title>
          </Card.ImgOverlay>
          <Card.Text className="eventCard--eventDate">
            <Badge bg="secondary">
              {new Date(event.eventDateTime).toDateString()}
            </Badge>
          </Card.Text>
          {renderCountDown()}
          <Card.Text className="eventCard--restaurantLeader">
            {renderRestaurantLeader()}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );

  function renderVotingIcon() {
    if (!isDecisionDatePassed) {
      return "🗳️";
    }
    if (!isFinalChoiceMade) {
      return "🔒";
    }
    return "🌟";
  }

  function renderCountDown() {
    // Renderer callback with condition
    if (isFinalChoiceMade) {
      return <></>;
    }
    if (isDecisionDatePassed) {
      return (
        <Card.Text className="eventCard--waiting-on-host-msg">
          Waiting on final host decision...
        </Card.Text>
      );
    } else {
      const countdownRenderer = ({ days, hours, minutes, seconds }) => {
        if (days > 0) {
          return <span>{days} days</span>;
        }
        if (hours > 0) {
          return <span>{hours} hours</span>;
        }
        if (minutes > 0) {
          return <span>{minutes} minutes</span>;
        }
        return <span>{seconds} seconds</span>;
      };
      return (
        <Card.Text className="eventCard--countdown">
          You have{" "}
          <Badge bg="info" text="dark">
            <Countdown
              date={event.decisionDateTime}
              renderer={countdownRenderer}
            />
          </Badge>{" "}
          left to vote
        </Card.Text>
      );
    }
  }

  function renderRestaurantLeader() {
    if (isDecisionDatePassed && isFinalChoiceMade) {
      return (
        <span>
          The winning restaurant is{" "}
          <Badge bg="success">
            {restLeader.restaurantName}
            {restLeader.restaurantGenre}
          </Badge>
        </span>
      );
    }
    return (
      <span>
        Current restaurant leader is:{" "}
        <Badge bg="warning" text="dark">
          {restLeader.restaurantName}
          {restLeader.restaurantGenre}
        </Badge>
      </span>
    );
  }

  function StyledBadge(props) {
    return (
      <Badge
        className="border"
        bg={variant}
        text={variant === "light" ? "dark" : "light"}
      >
        {props.children}
      </Badge>
    );
  }
}
