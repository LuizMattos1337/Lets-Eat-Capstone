package com.techelevator.dao;

import com.techelevator.model.Restaurant;

import java.util.List;

public interface RestaurantDao {

    /**
    * This method gets a list of restaurants by zipcode selected in drop down
     * This method is used in homepage and in Create Event page- Step 2 in sequence of Event POST requests
     * @param zipCode the zip code selected from the drop down
     * @return a list of restaurant objects for the zip code selected
    */
    List<Restaurant> getRestaurantsByZipCode(int zipCode);

    /**
     * This method gets a list of ranked restaurants for a created event, ordered by Tally
     * This method is used in guest voting and host page
     * @param eventId the id of the event that a guest/host will view and/or vote on
     * @return a list of restaurant objects for given event id, ranked by tally (descending)
     */
    List<Restaurant> getRankedRestaurantsForEvent(int eventId);
}
