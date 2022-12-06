/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import RestaurantRow from "./RestaurantRow";
import { Table } from "react-bootstrap";
import { useUser } from "../UserProvider/UserProvider";
import axios from "axios";
import { baseUrl } from "../../Shared/baseUrl";

export default function RestaurantsView(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [restaurants, setRestaurants] = useState(exampleRestaurants);
	/* Modes: byEventId, byEventIdFinalist, byZipcode */
	const { mode, searchTerm, refreshEventFunction } = props;
	const user = useUser();
	const authConfig = {
		headers: { Authorization: `Bearer ${user.token}` },
	};
	const finalChoiceId = props.finalChoiceId;

	useEffect(() => {
		/* Effects */
		console.log(
			`Effect - Fetching restaurant list for ${mode}: ${searchTerm}`,
			`with jwt:${user.token}`
		);
		if (mode === "byEventId" || mode === "byEventIdFinalist") {
			fetchRestaurantsByEventId();
		}
		if (mode === "byZipcode") {
			fetchRestaurantsByZipcode();
		}
		return () => {
			/* Clean up for effect */
		};
	}, []);

	async function fetchRestaurantsByEventId() {
		console.log(`Fetching ${mode} ${searchTerm}`);
		try {
			setIsLoading(true);
			const resp = await axios.get(
				`${baseUrl}/restaurant/ranked/${searchTerm}`
			);
			setRestaurants(resp.data);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	}
	async function fetchRestaurantsByZipcode() {
		console.log(`Fetching ${mode} ${searchTerm}`);
		try {
			setIsLoading(true);
			const resp = await axios.get(
				`${baseUrl}/restaurant/zipcode/${searchTerm}`,
				authConfig
			);
			console.log(`byZipcode`, resp.data);
			setRestaurants(resp.data);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	}

	return (
		<>
			<small className="dev-mode">{JSON.stringify(props)}</small>
			<Table bordered className="restaurants-view">
				<tbody className="">
					{generateRestaurantElements(
						restaurants,
						mode,
						searchTerm,
						finalChoiceId,
						refreshEventFunction
					)}
				</tbody>
			</Table>
		</>
	);
}

/**
 *
 * @param {object[]} restaurants - List of restaurant objects
 * @param {string} mode - byEventId, byEventIdFinalist, byZipcode
 * @param {string} searchTerm - either eventId or
 * @returns JSX obects
 */
function generateRestaurantElements(
	restaurants,
	mode,
	searchTerm,
	finalChoiceId,
	refreshEventFunction
) {
	if (restaurants.length === 0) {
		return (
			<tr>
				<td>Oops, something went wrong...</td>
			</tr>
		);
	}
	return restaurants.map((rest) => (
		<RestaurantRow
			{...rest}
			key={rest.restaurantId}
			mode={mode}
			searchTerm={searchTerm}
			finalChoiceId={finalChoiceId}
			refreshEventFunction={refreshEventFunction}
		/>
	));
}
const exampleRestaurants = [
	{
		restaurantId: 0,
		pictureUrl:
			"https://www.pexels.com/photo/close-up-photo-of-rice-and-tacos-2087748/",
		restaurantName: "",
		restaurantGenre: "",
		restaurantAddress: "",
		zipCode: 99999,
		openTime: "11:00:00",
		closeTime: "23:00:00",
		priceRange: 1,
		hasNumber: true,
	},
];
