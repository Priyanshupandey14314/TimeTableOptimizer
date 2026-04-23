package com.timemaster.timetableoptimizer.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String code;
    private int weeklyHours;
    private String type; // "THEORY" or "LAB"

    @ManyToOne
    @JoinColumn(name = "class_section_id")
    @com.fasterxml.jackson.annotation.JsonBackReference(value = "class-subject")
    private ClassSection classSection;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getWeeklyHours() {
        return weeklyHours;
    }

    public void setWeeklyHours(int weeklyHours) {
        this.weeklyHours = weeklyHours;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ClassSection getClassSection() {
        return classSection;
    }

    public void setClassSection(ClassSection classSection) {
        this.classSection = classSection;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
}
