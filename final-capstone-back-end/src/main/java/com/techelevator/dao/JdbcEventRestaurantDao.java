package com.techelevator.dao;


import com.techelevator.exception.EventRestaurantNotFoundException;
import com.techelevator.model.EventRestaurant;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcEventRestaurantDao implements EventRestaurantDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcEventRestaurantDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    /*
     * This method gets list of ranked restaurants tallys
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that a guest/host will view the tallys for
     * @return a list of event restaurant objects by tally (descending) for given event id
     */
    public List<EventRestaurant> getTallyListByEventId(int eventId) {

        List<EventRestaurant> tallyList = new ArrayList<>();

        String sql = "SELECT event_id, restaurant_id, tally FROM event_restaurant " +
                "WHERE event_restaurant.event_id = ? " +
                "ORDER BY event_restaurant.tally DESC;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, eventId);
        while(results.next()) {
            tallyList.add(mapRowToEventRestaurant(results));
        }
        return tallyList;
    }

    @Override
    /*
     * This method gets 1 event restaurant row for a particular restaurant and event
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the restaurant and tally are associated with
     * @param restaurantId the id of the restaurant that the tally is for
     * @return one single EventRestaurant object for a particular event and restaurant
     */
    public EventRestaurant getSingleTallyByEventIdAndRestaurantId(int eventId, int restaurantId) throws EventRestaurantNotFoundException {

        EventRestaurant eventRestaurant = new EventRestaurant();

        String sql = "SELECT event_id, restaurant_id, tally FROM event_restaurant " +
                "WHERE event_id = ? AND restaurant_id = ?;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, eventId, restaurantId);
        if(result.wasNull()){
            throw new EventRestaurantNotFoundException("EventRestaurant Row does not exist for the provided event id and restaurant id");
        }
        if (result.next()) {
            eventRestaurant = mapRowToEventRestaurant(result);
        }
        return eventRestaurant;
    }

    @Override
    /*
     * This method adds 1 to the current tally and updates the tally column in the event restaurant table when guest votes thumbs up on a restaurant
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the restaurant and tally are tied to
     * @param restaurantId the id of the restaurant for which the tally is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    public boolean updateTallyThumbsUp(int eventId, int restaurantId) {
        String sql = "UPDATE event_restaurant SET tally = (tally + 1) " +
                "WHERE event_id = ? AND restaurant_id = ?;";
        return jdbcTemplate.update(sql, eventId,restaurantId) == 1;
    }

    @Override
    /*
     * This method subtracts 1 to the current tally and updates the tally column in the event restaurant table when guest votes thumbs down on a restaurant
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the restaurant and tally are tied to
     * @param restaurantId the id of the restaurant for which the tally is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    public boolean updateTallyThumbsDown(int eventId, int restaurantId) {
        String sql = "UPDATE event_restaurant SET tally = (tally - 1) " +
                "WHERE event_id = ? AND restaurant_id = ?;";
        return jdbcTemplate.update(sql, eventId,restaurantId) == 1;
    }

    @Override
    /*
     * This method adds rows for each restaurant in an event, to track the tally of each restaurant
     * This method is used in the Create Event page- Step 3 in sequence of Event POST requests
     * (number of rows created is determined by number of restaurants by zipcode selected on Create EVent page)
     * @param eventRestaurant an object of the EventRestaurant class, with event id and restaurant id provided (tally starts at default 0)
     * @return boolean
     *  true if creating the rows was successful
     *  false if it was not successful
     */
    public boolean createEventRestaurant(EventRestaurant eventRestaurant) {
            String sql = "INSERT INTO event_restaurant (event_id, restaurant_id, tally) " +
                    "VALUES (?, ?, ?); ";
            return jdbcTemplate.update(sql, eventRestaurant.getEventId(), eventRestaurant.getRestaurantId(), 0) == 1;

    }


    private EventRestaurant mapRowToEventRestaurant(SqlRowSet rowSet) {
        EventRestaurant eventRestaurant = new EventRestaurant();
        eventRestaurant.setEventId(rowSet.getInt("event_id"));
        eventRestaurant.setRestaurantId(rowSet.getInt("restaurant_id"));
        eventRestaurant.setTally(rowSet.getInt("tally"));

        return eventRestaurant;
    }


}
