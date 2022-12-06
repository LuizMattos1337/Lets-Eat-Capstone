package com.techelevator.dao;

import com.techelevator.exception.EventNotFoundException;
import com.techelevator.model.Event;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
public class JdbcEventDao implements EventDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcEventDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    /*
      This method gets a list of events by username
      This method is used in the "My Events" page
      @param username the username of the logged-in user that is viewing their "My Events" page
     * @return a list of event objects for the username given
     */
    public List<Event> getEventsByUsername(String username) {
        List<Event> events = new ArrayList<>();

        String sql = "SELECT * FROM event " +
                "JOIN users ON event.user_id = users.user_id " +
                "WHERE users.username ILIKE ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, username);
        while(results.next()) {
            events.add(mapRowToEvent(results));
        }

        return events;
    }

    @Override
    /*
     * This method gets a single event by event id
     * This method is used in the Guest & Host event voting/viewing page
     * @param eventId the id of event that is being retrieved
     * @return Event object for single row from Event table
     */
    public Event getSingleEventByEventId(int eventId) throws EventNotFoundException {
        Event event = new Event();

        String sql = "SELECT * FROM event " +
                "WHERE event_id = ?";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, eventId);
        if (result.wasNull()) {
            throw new EventNotFoundException("Event does not exist with event id provided");
        }
        if (result.next()) {
            event = mapRowToEvent(result);
        }
        return event;
    }

    @Override
    /*
     * This method creates a new event row in the event table
     * This method is used in the Create Event Page- Step 1 in sequence of Event POST requests
     * @param event an object of the Event class, with all information coming from form in Create Event page
     * @return Event object with information added to the event table
     */
    public Event createEvent(Event event) {
        String sql = "INSERT INTO event (event_name, event_date_time, zip_code, decision_date_time, number_of_guests, user_id, final_choice_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING event_id;";
            Integer eventId = jdbcTemplate.queryForObject(sql, Integer.class, event.getEventName(), event.getEventDateTime(), event.getZipCode(), event.getDecisionDateTime(), event.getNumberOfGuests(), event.getUserId(), event.getFinalChoiceId());
            event.setEventId(eventId);

          return event;
    }

    @Override
    /*
     *  This method adds the restaurant id of the host's final choice, to the final_choice_id column in event table
     *  This method is used in the Host voting/view page to select final choice after decision date/time passes
     * @param eventId the id of the event that choice is being added to
     * @param restaurantId the id of the restaurant being selected as final choice for evebt
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    public boolean addFinalChoiceId(int eventId, int restaurantId) {
        String sql = "UPDATE event SET final_choice_id = ? " +
                "WHERE event_id = ?;";
        return jdbcTemplate.update(sql, restaurantId, eventId) == 1;
    }

    private Event mapRowToEvent(SqlRowSet rowSet) {
        Event event = new Event();
        event.setEventId(rowSet.getInt("event_id"));
        event.setEventName(rowSet.getString("event_name"));
        if (rowSet.getTimestamp("event_date_time") != null) {
            event.setEventDateTime(rowSet.getTimestamp("event_date_time").toLocalDateTime());
        }
        event.setZipCode(rowSet.getInt("zip_code"));
        if (rowSet.getTimestamp("decision_date_time") != null) {
            event.setDecisionDateTime(rowSet.getTimestamp("decision_date_time").toLocalDateTime());
        }
        event.setNumberOfGuests(rowSet.getInt("number_of_guests"));
        event.setUserId(rowSet.getLong("user_id"));
        event.setFinalChoiceId(rowSet.getInt("final_choice_id"));
        return event;
    }


}
