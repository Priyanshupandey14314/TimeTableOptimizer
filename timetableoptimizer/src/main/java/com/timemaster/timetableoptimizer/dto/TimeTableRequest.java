package com.timemaster.timetableoptimizer.dto;

import java.util.List;

public class TimeTableRequest {
    private Long classSectionId;
    private List<Long> teacherIds;
    private List<Long> subjectIds;

    // Default constructor
    public TimeTableRequest() {
    }

    // Constructor with parameters
    public TimeTableRequest(Long classSectionId, List<Long> teacherIds, List<Long> subjectIds) {
        this.classSectionId = classSectionId;
        this.teacherIds = teacherIds;
        this.subjectIds = subjectIds;
    }

    // Getters and Setters
    public Long getClassSectionId() {
        return classSectionId;
    }

    public void setClassSectionId(Long classSectionId) {
        this.classSectionId = classSectionId;
    }

    public List<Long> getTeacherIds() {
        return teacherIds;
    }

    public void setTeacherIds(List<Long> teacherIds) {
        this.teacherIds = teacherIds;
    }

    public List<Long> getSubjectIds() {
        return subjectIds;
    }

    public void setSubjectIds(List<Long> subjectIds) {
        this.subjectIds = subjectIds;
    }
}

