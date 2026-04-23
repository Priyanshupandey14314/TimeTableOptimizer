package com.timemaster.timetableoptimizer.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ClassSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Example: "10A"

    @ManyToOne
    @JoinColumn(name = "department_id")
    @com.fasterxml.jackson.annotation.JsonBackReference(value = "dept-class")
    private Department department; // Relationship to Department entity

    @OneToMany(mappedBy = "classSection", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference(value = "class-subject")
    private java.util.List<Subject> subjects;

    private int studentCount;

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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public int getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    public java.util.List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(java.util.List<Subject> subjects) {
        this.subjects = subjects;
    }

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "room_id")
    private Room room;

    // Getters and Setters
}
