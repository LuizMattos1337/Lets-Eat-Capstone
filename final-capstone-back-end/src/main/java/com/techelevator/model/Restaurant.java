package com.techelevator.model;

import javax.validation.constraints.NotBlank;
import java.time.LocalTime;

public class Restaurant {

    @NotBlank
    private int restaurantId;
    @NotBlank
    private String pictureUrl;
    @NotBlank
    private String logo;
    @NotBlank
    private String restaurantName;
    @NotBlank
    private String restaurantGenre;
    @NotBlank
    private String restaurantAddress;
    @NotBlank
    private int zipCode;
    @NotBlank
    private LocalTime openTime;
    @NotBlank
    private LocalTime closeTime;
    @NotBlank
    private int priceRange;
    private boolean hasNumber;

    public Restaurant() {
    }

    public Restaurant(int restaurantId, String pictureUrl, String logo, String restaurantName, String restaurantGenre, String restaurantAddress, int zipCode, LocalTime openTime, LocalTime closeTime, int priceRange, boolean hasNumber) {
        this.restaurantId = restaurantId;
        this.pictureUrl = pictureUrl;
        this.logo = logo;
        this.restaurantName = restaurantName;
        this.restaurantGenre = restaurantGenre;
        this.restaurantAddress = restaurantAddress;
        this.zipCode = zipCode;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.priceRange = priceRange;
        this.hasNumber = hasNumber;
    }

    public int getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(int restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getRestaurantGenre() {
        return restaurantGenre;
    }

    public void setRestaurantGenre(String restaurantGenre) {
        this.restaurantGenre = restaurantGenre;
    }

    public String getRestaurantAddress() {
        return restaurantAddress;
    }

    public void setRestaurantAddress(String restaurantAddress) {
        this.restaurantAddress = restaurantAddress;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }

    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalTime closeTime) {
        this.closeTime = closeTime;
    }

    public int getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(int priceRange) {
        this.priceRange = priceRange;
    }

    public boolean isHasNumber() {
        return hasNumber;
    }

    public void setHasNumber(boolean hasNumber) {
        this.hasNumber = hasNumber;
    }
}
