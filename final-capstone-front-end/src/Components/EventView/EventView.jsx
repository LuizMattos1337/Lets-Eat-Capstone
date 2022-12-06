/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import RestaurantsView from "../RestaurantsView/RestaurantsView";
import { Container, Badge } from "react-bootstrap";
import { useParams } from "react-router";
import axios from "axios";
import { baseUrl } from "../../Shared/baseUrl";
import { useUser } from "../UserProvider/UserProvider";
import GuestLinks from "../GuestLinks/GuestLinks";

export default function EventView(props) {
	const [event, setEvent] = useState(placeholderEvent);
	const [hasVotingDeadlinePassed, setHasVotingDeadlinePassed] =
		useState(false);
	const { eventViewId } = useParams();
	const user = useUser();

	useEffect(() => {
		/* Effects */
		fetchEventById();
		return () => {
			/* Clean up functions */
		};
	}, []);

	async function fetchEventById() {
		const fetchUrl = `${baseUrl}/event/view/${eventViewId}`;


		try {
			const eventResp = await axios.get(fetchUrl);
			setEvent(eventResp.data);
			setHasVotingDeadlinePassed(
				new Date() > new Date(eventResp.data.decisionDateTime)
			);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Container>
			<div className="p-2 mb-4 bg-dark rounded-3">
				<Container
					fluid
					className="event-banner py-1 position-relative"
				>
					{
						<Badge
							id="vote-lock-icon"
							className="position-absolute top-0 end-0 fs-5"
						>
							{!hasVotingDeadlinePassed
								? "🗳️"
								: event.finalChoiceId === 0
								? "🔒"
								: "🌟"}
						</Badge>
					}

					<h1 id="event-name" className="display-1 ">
						{event.eventName}
					</h1>
					<Container className="d-flex flex-column lead">
						<div>
							Event start date:{" "}
							{new Date(event.eventDateTime).toDateString()}
						</div>
						<div>
							Decision Deadline:{" "}
							{new Date(event.decisionDateTime).toDateString()}
						</div>
						<small className="text-muted dev-mode">
							Countdown to vote?
						</small>
					</Container>
				</Container>
			</div>
			{hasVotingDeadlinePassed ? (
				<RestaurantsView
					searchTerm={eventViewId}
					mode="byEventIdFinalist"
					finalChoiceId={event.finalChoiceId}
					refreshEventFunction={fetchEventById}

				/>
			) : (
				<RestaurantsView
					searchTerm={eventViewId}
					mode="byEventId"
					finalChoiceId={event.finalChoiceId}
				/>
			)}

			{user.id === event.userId && <GuestLinks eventId={event.eventId} />}
		</Container>
	);
}

const placeholderEvent = {
	eventId: 0,
	eventName: "Placeholder Event",
	eventDateTime: "Some time",
	zipCode: 11111,
	decisionDateTime: "Eventually",
	numberOfGuests: 99,
	userId: 1,
};
