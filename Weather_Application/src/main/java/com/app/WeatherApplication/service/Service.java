package com.app.WeatherApplication.service;

import com.app.WeatherApplication.dto.*;
import com.app.WeatherApplication.dto.WeatherForeCast;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service

public class Service {
    RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.api.url}")
    private String apiurl;

    @Value("${weather.api.key}")
    private String apikey;

    @Value("${weather.api.forecast.url}")
    private String apiforecasturl;


    // Current Weather
    public WeatherResponse getData(String city){

        String url = apiurl + "?key=" + apikey + "&q=" + city;

        Root response = restTemplate.getForObject(url, Root.class);

        WeatherResponse weatherResponse = new WeatherResponse();

        weatherResponse.setCity(response.getLocation().name);
        weatherResponse.setRegion(response.getLocation().region);
        weatherResponse.setCountry(response.getLocation().country);
        weatherResponse.setCondition(response.getCurrent().getCondition().getText());
        weatherResponse.setTemperature(response.getCurrent().getTemp_c());

        return weatherResponse;
    }


    // Forecast Weather
    public WeatherForeCast getForecast(String city, int days){

        WeatherForeCast response = new WeatherForeCast();

        String url = apiforecasturl + "?key=" + apikey + "&q=" + city + "&days=" + days;

        Root apiResponse = restTemplate.getForObject(url, Root.class);


        // Current weather from same forecast response
        WeatherResponse weatherResponse = new WeatherResponse();

        weatherResponse.setCity(apiResponse.getLocation().name);
        weatherResponse.setRegion(apiResponse.getLocation().region);
        weatherResponse.setCountry(apiResponse.getLocation().country);
        weatherResponse.setTemperature(apiResponse.getCurrent().getTemp_c());
        weatherResponse.setCondition(apiResponse.getCurrent().getCondition().getText());

        response.setWeatherResponse(weatherResponse);


        // Forecast data
        List<DayTemp> dayTempList = new ArrayList<>();

        Forecast forecast = apiResponse.getForecast();

        for(Forecastday listforecast : forecast.getForecastday()){

            DayTemp day = new DayTemp();

            day.setDate(listforecast.getDate());
            day.setMinTemp(listforecast.getDay().mintemp_c);
            day.setAvgTemp(listforecast.getDay().avgtemp_c);
            day.setMaxTemp(listforecast.getDay().maxtemp_c);

            dayTempList.add(day);
        }

        response.setDayTemp(dayTempList);

        return response;
    }

}
