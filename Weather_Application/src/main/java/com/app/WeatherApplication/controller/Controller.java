package com.app.WeatherApplication.controller;

import com.app.WeatherApplication.dto.WeatherForeCast;
import com.app.WeatherApplication.dto.WeatherResponse;
import com.app.WeatherApplication.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin
@RestController
@RequestMapping("/weather")
public class Controller {
    @Autowired
    private Service service;

    @GetMapping("/my/{city}")
    public WeatherResponse getWeather(@PathVariable String city) {

        return service.getData(city);
    }
    @GetMapping("/forecast/{city}")
    public WeatherForeCast getForecast(@RequestParam String city, @RequestParam int days) {

        return service.getForecast(city, days);
    }
}
