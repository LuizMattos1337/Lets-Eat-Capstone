package com.techelevator.dao;

import com.techelevator.exception.EventRestaurantNotFoundException;
import com.techelevator.model.EventRestaurant;

import java.util.List;

public interface EventRestaurantDao {

    /**
     * This method gets list of ranked restaurants tallys
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that a guest/host will view the tallys for
     * @return a list of event restaurant objects by tally (descending) for given event id
     */
    List<EventRestaurant> getTallyListByEventId(int eventId);

    /**
     * This method gets 1 event restaurant row for a particular restaurant and event
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the restaurant and tally are associated with
     * @param restaurantId the id of the restaurant that the tally is for
     * @return one single EventRestaurant object for a particular event and restaurant
     */
    EventRestaurant getSingleTallyByEventIdAndRestaurantId(int eventId, int restaurantId) throws EventRestaurantNotFoundException;

    /**
     * This method adds 1 to the current tally and updates the tally column in the event restaurant table when guest votes thumbs up on a restaurant
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the restaurant and tally are tied to
     * @param restaurantId the id of the restaurant for which the tally is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    boolean updateTallyThumbsUp(int eventId, int restaurantId);

    /**
     * This method subtracts 1 to the current tally and updates the tally column in the event restaurant table when guest votes thumbs down on a restaurant
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the restaurant and tally are tied to
     * @param restaurantId the id of the restaurant for which the tally is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    boolean updateTallyThumbsDown(int eventId, int restaurantId);

    /**
     * This method adds rows for each restaurant in an event, to track the tally of each restaurant
     * This method is used in the Create Event page- Step 3 in sequence of Event POST requests
     * (number of rows created is determined by number of restaurants by zipcode selected on Create EVent page)
     * @param eventRestaurant an object of the EventRestaurant class, with event id and restaurant id provided (tally starts at default 0)
     * @return boolean
     *  true if creating the rows was successful
     *  false if it was not successful
     */
    boolean createEventRestaurant(EventRestaurant eventRestaurant);
}

