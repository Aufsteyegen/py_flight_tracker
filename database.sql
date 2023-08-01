CREATE DATABASE sky_journal;

CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_id VARCHAR(100),
    callsign VARCHAR(20),
    origin VARCHAR(100),
    destination VARCHAR(100),
    aircraft_type VARCHAR(50),
    aircraft_tail VARCHAR(10),
    distance INTEGER,
    flight_time INTEGER,
    flight_date VARCHAR(20),
    live BOOLEAN,
    track BOOLEAN
)
