DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS restaurant CASCADE;
DROP TABLE IF EXISTS event_guest CASCADE;
DROP TABLE IF EXISTS event_restaurant CASCADE;
DROP TABLE IF EXISTS guest_vote CASCADE;

CREATE TABLE event (
	event_id serial NOT NULL,
	event_name varchar(50) NOT NULL,
    event_date_time timestamp NOT NULL,
    zip_code integer NOT NULL,
    decision_date_time timestamp NOT NULL,
    number_of_guests integer NOT NULL,
    user_id integer NOT NULL,
    final_choice_id integer DEFAULT(0),
	CONSTRAINT PK_event PRIMARY KEY (event_id),
    CONSTRAINT FK_event_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE restaurant (
	restaurant_id serial NOT NULL,
	picture_url varchar NOT NULL,
    logo varchar NOT NULL,
    restaurant_name varchar(50) NOT NULL,
    restaurant_genre text NOT NULL,
    restaurant_address varchar(50)NOT NULL,
    zip_code integer NOT NULL,
    open_time time NOT NULL,
    close_time time NOT NULL,
    price_range integer NOT NULL,
    has_number boolean DEFAULT (FALSE), 
	CONSTRAINT PK_restaurant PRIMARY KEY (restaurant_id)
);

CREATE TABLE event_guest (
    guest_id serial NOT NULL,
    event_id integer NOT NULL,
    guest_link varchar(20) UNIQUE NOT NULL,
	CONSTRAINT PK_event_guest PRIMARY KEY (guest_id),
    CONSTRAINT FK_event_guest_event FOREIGN KEY (event_id) REFERENCES event(event_id)

);

CREATE TABLE event_restaurant (
    event_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    tally integer NOT NUll DEFAULT (0),
    CONSTRAINT PK_event_restaurant PRIMARY KEY (event_id, restaurant_id),
    CONSTRAINT FK_event_restaurant_restaurant FOREIGN KEY (restaurant_id) 
        REFERENCES restaurant(restaurant_id),
    CONSTRAINT FK_event_restaurant_event FOREIGN KEY (event_id)
        REFERENCES event(event_id)
);

CREATE TABLE guest_vote (
    event_id integer NOT NULL,
    guest_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    vote integer NOT NULL DEFAULT (0),
    CONSTRAINT PK_guest_vote PRIMARY KEY (event_id, guest_id, restaurant_id),
    CONSTRAINT FK_guest_vote_event FOREIGN KEY (event_id) 
        REFERENCES event(event_id),
    CONSTRAINT FK_guest_vote_event_guest FOREIGN KEY (guest_id)
        REFERENCES event_guest(guest_id),
    CONSTRAINT FK_guest_vote_restaurant FOREIGN KEY (restaurant_id)
        REFERENCES restaurant(restaurant_id)
);




