import React from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import EventView from "../EventView/EventView";
import { Route, Routes } from "react-router-dom";
import { useUser } from "../UserProvider/UserProvider";
import { Navigate } from "react-router";
import MyEvents from "../MyEvents/MyEvents";

import Restaurants from "../Restaurants/Restaurants";
import NewEvent from "../NewEvent/NewEvent";
export default function Main() {
	const user = useUser();

	return (
		<>
			<Navbar />
			<Routes>
				<Route
					path="/home"
					element={
						user.token !== undefined ? (
							<MyEvents />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>

				<Route
					path="/home"
					element={
						user.token !== undefined ? (
							<Home />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				
				<Route
					path="/newEvent"
					element={
						user.token !== undefined ? (
							<NewEvent />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				<Route
					path="/eventView/:eventViewId"
					element={
						user.token !== undefined ? (
							<EventView />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>
				<Route path="/vote/:eventViewId/:guestLink" element={<EventView/>}/>

				<Route
					path="/login"
					element={
						!user.token ? (
							<Login />
						) : (
							<Navigate to="/home" replace />
						)
					}
				/>
				<Route path="/Restaurants" element={<Restaurants />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<Navigate to="/home" replace />} />
			</Routes>
			{/* This is a debug menu for the current Context */}
			{/* Delete this before final */}
			<aside className="dev-mode">
				<small>
					<hr />
					Userid is{" "}
					<strong>{user.id === null ? "null" : "not null"}</strong>
					<br />
					Token is{" "}
					<strong>
						{user.token === undefined ? "undefined" : "defined"}
					</strong>
				</small>
			</aside>
		</>
	);
}
