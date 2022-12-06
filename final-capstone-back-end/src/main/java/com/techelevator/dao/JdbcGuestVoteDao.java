package com.techelevator.dao;

import com.techelevator.exception.GuestVoteNotFoundException;
import com.techelevator.model.GuestVote;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcGuestVoteDao implements GuestVoteDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcGuestVoteDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    /*
     * This method gets a list of guest votes for 1 guest from guest_vote table by event id, guest id
     * This method is used in guest and host voting pages
     * @param eventId the id of the event a list of votes for 1 guest is needed for
     * @param guestId the id of the guest that the list of votes is needed for
     * @return a list of guest vote objects, for the given event id
     */
    public List<GuestVote> getListOfGuestVotes(int eventId, int guestId) {
        List<GuestVote> guestVoteList = new ArrayList<>();

        String sql = "SELECT event_id, guest_id, restaurant_id, vote FROM guest_vote " +
                "WHERE event_id = ? AND guest_id = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, eventId, guestId);
        while(results.next()) {
            guestVoteList.add(mapRowToGuestVote(results));
        }
        return guestVoteList;
    }

    @Override
    /*
     * This method gets one row in guest_vote table by event id, guest id, and restaurant id
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event the guest, restaurant, and vote are tied to
     * @param guestId the id of the guest for whom the vote is being retrieved
     * @param restaurantId the id of the restaurant for which the vote is being retrieved
     * @return one single Guest Vote object for a particular event, guest, and restaurant
     */
    public GuestVote getSingleGuestVote(int eventId, int guestId, int restaurantId) throws GuestVoteNotFoundException {
        GuestVote guestVote = new GuestVote();

        String sql = "SELECT event_id, guest_id, restaurant_id, vote FROM guest_vote " +
                "WHERE event_id = ? AND guest_id = ? AND restaurant_id = ?;";
        SqlRowSet result = jdbcTemplate.queryForRowSet(sql, eventId, guestId, restaurantId);
        if(result.wasNull()){
            throw new GuestVoteNotFoundException("Guest Vote row does not exist for the provided event id, guest id, and restaurant id");
        }
        if (result.next()) {
            guestVote = mapRowToGuestVote(result);
        }
        return guestVote;
    }

    @Override
    /*
     * This method adds "1" to the vote column in the Guest Vote table when guest votes thumbs up on a restaurant
     * This method is used in guest and host event viewing/voting pages
     * @param eventId the id of the event that the guest, restaurant, and vote are tied to
     * @param guestId the id of the guest for whom the vote is being updated
     * @param restaurantId the id of the restaurant for which the vote is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    public boolean addGuestVoteUp(int eventId, int guestId, int restaurantId){
        String sql = "UPDATE guest_vote SET vote = 1 " +
                "WHERE event_id = ? AND guest_id = ? AND restaurant_id =?;";
        return jdbcTemplate.update(sql, eventId, guestId, restaurantId) == 1;
    }

    @Override
    /*
     * This method adds "-1" to the vote column in the Guest Vote table when guest votes thumbs down on a restaurant
     * This method is used in guest and host voting pages
     * @param eventId the id of the event that the guest, restaurant, and vote are tied to
     * @param guestId the id of the guest for whom the vote is being updated
     * @param restaurantId the id of the restaurant for which the vote is being updated
     * @return boolean
     *  true if adding the vote was successful
     *  false if it was not successful
     */
    public boolean addGuestVoteDown(int eventId, int guestId, int restaurantId){
        String sql = "UPDATE guest_vote SET vote = -1 " +
                "WHERE event_id = ? AND guest_id = ? AND restaurant_id =?;";
        return jdbcTemplate.update(sql, eventId, guestId, restaurantId) == 1;
    }

    @Override
    /*
     * This method adds rows for each guest and each restaurant in an event, to track the voting of the guest by restaurant
     * This method is used in the Create Event page- Step 6 in sequence of Event POST requests
     * (number of rows created is determined by Number of Guests, and number of restaurants for zip code given in Create Event form)
     * @param guestVote an object of the GuestVote class, with event id, guest id, and restaurant id provided (vote starts as null)
     * @return boolean
     *  true if creating the rows was successful
     *  false if it was not successful
     */
    public boolean createGuestVote(GuestVote guestVote) {
        String sql = "INSERT INTO guest_vote (event_id, guest_id, restaurant_id, vote) " +
                "VALUES (?, ?, ?, ?);";
        return jdbcTemplate.update(sql, guestVote.getEventId(), guestVote.getGuestId(), guestVote.getRestaurantId(), guestVote.getVote()) == 1;

    }

    private GuestVote mapRowToGuestVote(SqlRowSet rowSet) {
        GuestVote guestVote = new GuestVote();
        guestVote.setEventId(rowSet.getInt("event_id"));
        guestVote.setGuestId(rowSet.getInt("guest_id"));
        guestVote.setRestaurantId(rowSet.getInt("restaurant_id"));
        guestVote.setVote(rowSet.getInt("vote"));

        return guestVote;
    }

}
