import React from "react";
import { Navbar, Nav, Container, Offcanvas, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useUser, useUserUpdate } from "../UserProvider/UserProvider";
import logo from "../LetsEatLogo.png";

/**
 * Note: The href/to props on the Nav.Link components CANNOT be used!!!
 * They do not play nice with react-router!!!
 * Instead, we have to use the LinkContainer component from react-router-bootstrap
 * https://www.npmjs.com/package/react-router-bootstrap
 *  */
export default function Navbar2() {
	const user = useUser();
	const updateUser = useUserUpdate();

	return (
		<>
			<Navbar expand="lg" variant="dark" bg="dark" className="mb-3">
				<Container fluid>
					{/* Branding on left of nav */}
					<LinkContainer to="/home">
						<Navbar.Brand>
							<Image
								fluid
								rounded
								src={logo}
								style={{ height: "40px" }}
							/>
							&nbsp;
							Let's Eat!
						</Navbar.Brand>
					</LinkContainer>

					{/* Toggle button */}
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />

					{/* The burger menu, hidden offscreen until toggled */}
					<Navbar.Offcanvas placement="end">
						{/* Burger menu header */}
						<Offcanvas.Header closeButton>
							<Offcanvas.Title className="display-5">
								Let's Eat{user.token && `, ${user.username}`}!
							</Offcanvas.Title>
						</Offcanvas.Header>
						<Offcanvas.Body>
							{/* List of links in burger menu */}
							<Nav className="justify-content-end flex-grow-1 pe-3">
								<LinkContainer to="/home">
									<Nav.Link>Home</Nav.Link>
								</LinkContainer>

								{!user.token && (
									<LinkContainer to="/register">
										<Nav.Link>Register</Nav.Link>
									</LinkContainer>
								)}

								{user.token ? (
									<>
										<LinkContainer to="/Restaurants">
											<Nav.Link>Restaurants</Nav.Link>
										</LinkContainer>
										<LinkContainer to="/newEvent">
											<Nav.Link>New Event</Nav.Link>
										</LinkContainer>
										<Nav.Link
											onClick={(event) => {
												event.preventDefault();
												const blankUser = {
													id: null,
													username: "",
													authorities: [],
													token: undefined,
												};
												updateUser(blankUser);
											}}
										>
											Log Out
										</Nav.Link>
									</>
								) : (
									<LinkContainer to="/login">
										<Nav.Link>Log In</Nav.Link>
									</LinkContainer>
								)}
							</Nav>
						</Offcanvas.Body>
					</Navbar.Offcanvas>
				</Container>
			</Navbar>
		</>
	);
}
