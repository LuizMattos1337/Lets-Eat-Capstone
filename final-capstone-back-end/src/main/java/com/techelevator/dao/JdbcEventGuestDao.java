package com.techelevator.dao;

import com.techelevator.exception.EventGuestNotFoundException;
import com.techelevator.helper.GuestLink;
import com.techelevator.model.EventGuest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcEventGuestDao implements EventGuestDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcEventGuestDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    /*
     * This method gets list of event guest rows for event id given
     * This method is used in guest and host event viewing/voting pages and Create Event page -Step 5 in sequence of Event POST requests
     * @param eventId the id of the event that guests are attached to
     * @return a list of event guest objects for event id given
     */
    public List<EventGuest> getGuestList(int eventId) {
        List<EventGuest> guestList = new ArrayList<>();

        String sql = "SELECT guest_id, event_id, guest_link FROM event_guest " +
                "WHERE event_id = ? " +
                "ORDER BY guest_id;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, eventId);
        while(results.next()) {
            guestList.add(mapRowToEventGuest(results));
        }
        return guestList;
    }

    @Override
    /*
     * This method gets 1 event guest row for a particular guest
     * This method is used in guest and host event viewing/voting pages
     * @param guestId the id of the guest that record is needed for
     * @return one single EventGuest object for a particular guest
     */
    public EventGuest getSingleGuest(int guestId) throws EventGuestNotFoundException {
        EventGuest eventGuest = new EventGuest();

        String sql = "SELECT guest_id, event_id, guest_link FROM event_guest " +
                "WHERE event_id = ?;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, guestId);
        if(result.wasNull()){
            throw new EventGuestNotFoundException("Event Guest does not exist for the provided ID");
        }
        if (result.next()) {
            eventGuest = mapRowToEventGuest(result);
        }
        return eventGuest;
    }

    @Override
    /*
     * This method gets 1 event guest row for a particular guest using guestLink that is provided to view the guest page
     * This method is used in guest and host event viewing/voting pages
     * @param guestLink the link populated for the guest when the event is made
     * @return one single EventGuest object for a particular guest
     */
    public EventGuest getSingleGuestByLink(String guestLink) throws EventGuestNotFoundException {
        EventGuest eventGuest = new EventGuest();

        String sql = "SELECT guest_id, event_id, guest_link FROM event_guest " +
                "WHERE guest_link = ?;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, guestLink);
        if(result.wasNull()){
            throw new EventGuestNotFoundException("Event Guest does not exist for the provided ID");
        }
        if (result.next()) {
            eventGuest = mapRowToEventGuest(result);
        }
        return eventGuest;
    }

    @Override
    /*
     * This method adds rows for each guest attending event
     * This method is used in the Create Event page- Step 4 in sequence of Event POST requests
     * (number of rows created is determined by Number of Guests given in Create Event form)
     * @param eventGuest an object of the EventGuest class, with event id given-
     * (guest link made by GuestLink Class method, guestId populated by database)
     * @return EventGuest object with information added to the event guest table
     */
    public EventGuest createEventGuest(EventGuest eventGuest) {

        eventGuest.setGuestLink(GuestLink.makeGuestLink());
        String sql = "INSERT INTO event_guest (event_id, guest_link) " +
                "VALUES (?, ?) RETURNING guest_id;";
        Integer guestId = jdbcTemplate.queryForObject(sql, Integer.class, eventGuest.getEventId(), eventGuest.getGuestLink());
        eventGuest.setGuestId(guestId);

        return eventGuest;
    }


    private EventGuest mapRowToEventGuest(SqlRowSet rowSet) {
        EventGuest eventGuest = new EventGuest();
        eventGuest.setGuestId(rowSet.getInt("guest_id"));
        eventGuest.setEventId(rowSet.getInt("event_id"));
        eventGuest.setGuestLink(rowSet.getString("guest_link"));

        return eventGuest;
    }
}
