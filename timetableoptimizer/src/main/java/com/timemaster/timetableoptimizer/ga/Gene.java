package com.timemaster.timetableoptimizer.ga;

import com.timemaster.timetableoptimizer.model.*;

public class Gene {

    private ClassSection classSection;
    private Subject subject;
    private Teacher teacher;
    private Room room;
    private TimeSlot timeSlot;

    public Gene(ClassSection classSection, Subject subject, Teacher teacher, Room room, TimeSlot timeSlot) {
        this.classSection = classSection;
        this.subject = subject;
        this.teacher = teacher;
        this.room = room;
        this.timeSlot = timeSlot;
    }

    public ClassSection getClassSection() {
        return classSection;
    }

    public Subject getSubject() {
        return subject;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public Room getRoom() {
        return room;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    // For mutation operations
    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }
}
