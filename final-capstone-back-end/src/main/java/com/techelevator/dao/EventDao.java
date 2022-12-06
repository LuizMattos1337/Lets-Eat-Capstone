package com.techelevator.dao;

import com.techelevator.exception.EventNotFoundException;
import com.techelevator.model.Event;

import java.util.List;

public interface EventDao {

    /**
     * This method gets a list of events by username
     * This method is used in the "My Events" page
     * @param username the username of the logged-in user that is viewing their "My Events" page
     * @return a list of event objects for the username given
     */
    List<Event> getEventsByUsername(String username);

    /**
     * This method gets a single event by event id
     * This method is used in the Guest & Host event voting/viewing page
     * @param eventId the id of event that is being retrieved
     * @return Event object for single row from Event table
     */
    Event getSingleEventByEventId(int eventId) throws EventNotFoundException;

    /**
     * This method creates a new event row in the event table
     * This method is used in the Create Event Page- Step 1 in sequence of Event POST requests
     * @param event an object of the Event class, with all information coming from form in Create Event page
     * @return Event object with information added to the event table
     */
    Event createEvent(Event event);

    /**
     *  This method adds the restaurant id of the host's final choice, to the final_choice_id column in event table
     *  This method is used in the Host voting/view page to select final choice after decision date/time passes
     * @param eventId the id of the event that choice is being added to
     * @param restaurantId the id of the restaurant being selected as final choice for evebt
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    boolean addFinalChoiceId(int eventId, int restaurantId);
}
