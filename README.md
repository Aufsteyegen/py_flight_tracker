# Sky Journal 1.0.0

## What is this?

#### A React/Django-based flight logging tool to track live flights, log past flights, and see flight route statistics—all in one place.

Use it here: https://www.skyjournaltool.com/

## Usage

Search for a flight by its three-letter airline code, flight number,
and IATA departure and arrival codes. 
<p align="center">
    <img src="assets/search-example.png" width="400" height="200" />
</p>

___

If a live flight is found, you'll see its information card. Click the 'plus'
button to add it to your journal. Click the 'refresh' button to update the information
card. The bell icon toggles notifications (to be enabled in a future update).
<p align="center">
    <img src="assets/flight-card.png" width="400" height="400" />
</p>

___

If a live flight is not found, you will be prompted to enter its information
manually or start a new search. 

<p align="center">
    <img src="assets/manual-flight-info.png" width="400" height="400" />
</p>

___

View logged flights in your journal map, as well as cumulative flight statistics.
<p align="center">
    <img src="assets/journal.png" width="400" height="350" />
</p>

___

Sign in or sign up to backup your data. If you don't sign in, your data will
persist across browser refreshes and restarts, but may be erased (and cannot
be accessed on other devices).

## Attributions

- JeanExtreme's FlightRadar24 API: https://github.com/JeanExtreme002/FlightRadarAPI 
- Mapbox GL: https://docs.mapbox.com/mapbox-gl-js/api/

## Planned updates

- Flight notifications
- Historical flight lookup

 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
