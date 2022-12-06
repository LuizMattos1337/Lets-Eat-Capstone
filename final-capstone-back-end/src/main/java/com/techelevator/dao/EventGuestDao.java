package com.techelevator.dao;

import com.techelevator.exception.EventGuestNotFoundException;
import com.techelevator.model.EventGuest;

import java.util.List;

public interface EventGuestDao {

    /**
     * This method gets list of event guest rows for event id given
     * This method is used in guest and host event viewing/voting pages and Create Event page -Step 5 in sequence of Event POST requests
     * @param eventId the id of the event that guests are attached to
     * @return a list of event guest objects for event id given
     */
    List<EventGuest> getGuestList(int eventId);

    /**
     * This method gets 1 event guest row for a particular guest
     * This method is used in guest and host event viewing/voting pages
     * @param guestId the id of the guest that record is needed for
     * @return one single EventGuest object for a particular guest
     */
    EventGuest getSingleGuest(int guestId) throws EventGuestNotFoundException;

    /**
     * This method gets 1 event guest row for a particular guest using guestLink that is provided to view the guest page
     * This method is used in guest and host event viewing/voting pages
     * @param guestLink the link populated for the guest when the event is made
     * @return one single EventGuest object for a particular guest
     */
    EventGuest getSingleGuestByLink(String guestLink) throws EventGuestNotFoundException;

    /**
     * This method adds rows for each guest attending event
     * This method is used in the Create Event page- Step 4 in sequence of Event POST requests
     * (number of rows created is determined by Number of Guests given in Create Event form)
     * @param eventGuest an object of the EventGuest class, with event id given- guest link made by GuestLink Class method, guestId populated by database
     * @return EventGuest object with information added to the event guest table
     */
    EventGuest createEventGuest(EventGuest eventGuest);
}
