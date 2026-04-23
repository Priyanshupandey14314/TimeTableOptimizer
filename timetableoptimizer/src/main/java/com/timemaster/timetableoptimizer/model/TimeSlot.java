package com.timemaster.timetableoptimizer.model;

import jakarta.persistence.*;

@Entity
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String day; // MON, TUE, WED...
    private String startTime; // "09:00"
    private String endTime; // "10:00"
    private int periodNumber; // 1, 2, 3...

    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'TEACHING'")
    private String type = "TEACHING"; // TEACHING, BREAK, LUNCH

    private String name; // Optional name for the break (e.g. "Lunch")

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public int getPeriodNumber() {
        return periodNumber;
    }

    public void setPeriodNumber(int periodNumber) {
        this.periodNumber = periodNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
