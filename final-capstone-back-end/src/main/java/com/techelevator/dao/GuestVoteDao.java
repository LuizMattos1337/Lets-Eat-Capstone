package com.techelevator.dao;

import com.techelevator.exception.GuestVoteNotFoundException;
import com.techelevator.model.GuestVote;

import java.util.List;

public interface GuestVoteDao {

    /**
     * This method gets a list of guest votes for 1 guest from guest_vote table by event id, guest id
     * This method is used in guest and host voting pages
     * @param eventId the id of the event a list of votes for 1 guest is needed for
     * @param guestId the id of the guest that the list of votes is needed for
     * @return a list of guest vote objects, for the given event id
     */
    List<GuestVote> getListOfGuestVotes(int eventId, int guestId);

    /**
     * This method gets one row in guest_vote table by event id, guest id, and restaurant id
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event the guest, restaurant, and vote are tied to
     * @param guestId the id of the guest for whom the vote is being retrieved
     * @param restaurantId the id of the restaurant for which the vote is being retrieved
     * @return one single Guest Vote object for a particular event, guest, and restaurant
     */
    GuestVote getSingleGuestVote(int eventId, int guestId, int restaurantId) throws GuestVoteNotFoundException;

    /**
     * This method adds "1" to the vote column in the Guest Vote table when guest votes thumbs up on a restaurant
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the guest, restaurant, and vote are tied to
     * @param guestId the id of the guest for whom the vote is being updated
     * @param restaurantId the id of the restaurant for which the vote is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
    */
    boolean addGuestVoteUp(int eventId, int guestId, int restaurantId);

    /**
     * This method adds "-1" to the vote column in the Guest Vote table when guest votes thumbs down on a restaurant
     * This method is used in guest and host voting pages
     * @param eventId the id of the event that the guest, restaurant, and vote are tied to
     * @param guestId the id of the guest for whom the vote is being updated
     * @param restaurantId the id of the restaurant for which the vote is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    boolean addGuestVoteDown(int eventId, int guestId, int restaurantId);

    /**
     * This method adds rows for each guest and each restaurant in an event, to track the voting of the guest by restaurant
     * This method is used in the Create Event page- Step 6 in sequence of Event POST requests
     * (number of rows created is determined by Number of Guests, and number of restaurants for zip code given in Create Event form)
     * @param guestVote an object of the GuestVote class, with event id, guest id, and restaurant id provided (vote starts as 0)
     * @return boolean
     *  true if creating the rows was successful
     *  false if it was not successful
     */
    boolean createGuestVote(GuestVote guestVote);
}
