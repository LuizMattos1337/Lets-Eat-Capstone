/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../Shared/baseUrl";
import { useUser } from "../UserProvider/UserProvider";

export default function MyEvents() {
	const [eventList, setEventList] = useState(exampleEvents);
	const currentUser = useUser();
	const navigateTo = useNavigate();
	useEffect(() => {
		/* Effects */
		fetchMyEventsByUserName();
		return () => {
			/* Effect Cleanup */
		};
	}, []);

	async function fetchMyEventsByUserName() {
		const authConfig = {
			headers: { Authorization: `Bearer ${currentUser.token}` },
		};
		const fetchUrl = `${baseUrl}/event/${currentUser.username}`;
		const myEvents = await await axios.get(fetchUrl, authConfig);

		setEventList(myEvents.data);
	}

	return (
		<>
			<div className="box">
				<Container className="d-flex flex-column align-items-center gap-2">
					<h1 className="display-1 text-center">My Events</h1>
					<Container fluid className="d-flex gap-2 justify-content-center">
						<Button
							variant="outline-info"
							onClick={() => navigateTo("/Restaurants")}
						>
							View Restaurants
						</Button>
						<Button
							variant="outline-success"
							onClick={() => navigateTo("/newEvent")}
							>
							Create New Event
						</Button>
							</Container>
						<Container
							fluid
							className="d-flex flex-wrap gap-2 justify-content-center"
						>
						{renderEventCards(eventList)}
					</Container>
				</Container>
			</div>
		</>
	);
}

function renderEventCards(eventList = exampleEvents) {
	if (eventList.length === 0) {
		return (
			<Container className="text-center">
				<h2 className="lead">No events yet. Why not create one?</h2>
			</Container>
		);
	}
	return eventList.map((event) => (
		<>
			<EventCard event={event} key={event.eventId} />
		</>
	));
}

const exampleEvents = [
	{
		eventId: 0,
		eventName: "Event with voting",
		eventDateTime: "2022-12-01T12:00:00",
		zipCode: 11111,
		decisionDateTime: "2022-12-01T12:00:00",
		numberOfGuests: 99,
		userId: 1,
		finalChoiceId: 0,
	},
];
