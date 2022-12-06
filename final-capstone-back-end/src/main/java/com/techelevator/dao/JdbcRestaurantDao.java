package com.techelevator.dao;

import com.techelevator.model.Restaurant;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JdbcRestaurantDao implements RestaurantDao{

    private final JdbcTemplate jdbcTemplate;

    public JdbcRestaurantDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    /*
     * This method gets a list of restaurants by zipcode selected in drop down
     * This method is used in homepage and in Create Event page- Step 2 in sequence of Event POST requests
     * @param zipCode the zip code selected from the drop down
     * @return a list of restaurant objects for the zip code selected
     */
    public List<Restaurant> getRestaurantsByZipCode(int zipCode) {
        List<Restaurant> restaurants = new ArrayList<>();

        String sql = "SELECT * FROM restaurant " +
                "WHERE zip_code = ?;";
        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, zipCode);
        while(results.next()) {
            restaurants.add(mapRowToRestaurant(results));
        }

        return restaurants;
    }

    @Override
    /*
     * This method gets a list of ranked restaurants for a created event, ordered by Tally
     * This method is used in guest voting and host page
     * @param eventId the id of the event that a guest/host will view and/or vote on
     * @return a list of restaurant objects for given event id, ranked by tally (descending)
     */
    public List<Restaurant> getRankedRestaurantsForEvent(int eventId){
        List<Restaurant> rankedRestaurants = new ArrayList<>();

        String sql = "SELECT * FROM restaurant " +
                "JOIN event_restaurant ON restaurant.restaurant_id = event_restaurant.restaurant_id " +
                "WHERE event_restaurant.event_id = ? " +
                "ORDER BY event_restaurant.tally DESC;";

        SqlRowSet results = jdbcTemplate.queryForRowSet(sql, eventId);
        while(results.next()) {
            rankedRestaurants.add(mapRowToRestaurant(results));
        }
        return rankedRestaurants;
    }


    private Restaurant mapRowToRestaurant(SqlRowSet rowSet) {
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantId(rowSet.getInt("restaurant_id"));
        restaurant.setPictureUrl(rowSet.getString("picture_Url"));
        restaurant.setLogo(rowSet.getString("logo"));
        restaurant.setRestaurantName(rowSet.getString("restaurant_name"));
        restaurant.setRestaurantGenre(rowSet.getString("restaurant_genre"));
        restaurant.setRestaurantAddress(rowSet.getString("restaurant_address"));
        restaurant.setZipCode(rowSet.getInt("zip_code"));
        if(rowSet.getTime("open_time") != null) {
            restaurant.setOpenTime(rowSet.getTime("open_time").toLocalTime());
        }
        if(rowSet.getTime("close_time") != null) {
            restaurant.setCloseTime(rowSet.getTime("close_time").toLocalTime());
        }
        restaurant.setPriceRange(rowSet.getInt("price_range"));
        restaurant.setHasNumber(rowSet.getBoolean("has_number"));
        return restaurant;
    }
}
