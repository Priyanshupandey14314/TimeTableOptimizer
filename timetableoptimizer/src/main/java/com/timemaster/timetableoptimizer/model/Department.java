package com.timemaster.timetableoptimizer.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "dept-teacher")
    private List<Teacher> teachers;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @JsonManagedReference(value = "dept-class")
    private List<ClassSection> classSections;

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

    public List<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<Teacher> teachers) {
        this.teachers = teachers;
    }

    public List<ClassSection> getClassSections() {
        return classSections;
    }

    public void setClassSections(List<ClassSection> classSections) {
        this.classSections = classSections;
    }
}
