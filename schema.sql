CREATE DATABASE School_Management_System;
USE School_Management_System;

CREATE TABLE schools(
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    address VARCHAR(40) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);