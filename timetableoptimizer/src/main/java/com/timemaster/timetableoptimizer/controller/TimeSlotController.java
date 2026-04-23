package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.TimeSlot;
import com.timemaster.timetableoptimizer.services.TimeSlotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@CrossOrigin
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<TimeSlot> add(@RequestBody TimeSlot timeSlot) {
        validateTimeSlot(timeSlot);
        return org.springframework.http.ResponseEntity.ok(timeSlotService.addTimeSlot(timeSlot));
    }

    @GetMapping
    public org.springframework.http.ResponseEntity<List<TimeSlot>> getAll() {
        return org.springframework.http.ResponseEntity.ok(timeSlotService.getAllTimeSlots());
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<TimeSlot> get(@PathVariable Long id) {
        TimeSlot ts = timeSlotService.getTimeSlotById(id);
        if (ts == null) {
            throw new com.timemaster.timetableoptimizer.exception.ResourceNotFoundException(
                    "TimeSlot not found with id: " + id);
        }
        return org.springframework.http.ResponseEntity.ok(ts);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<TimeSlot> update(@PathVariable Long id,
            @RequestBody TimeSlot timeSlot) {
        validateTimeSlot(timeSlot);
        return org.springframework.http.ResponseEntity.ok(timeSlotService.updateTimeSlot(id, timeSlot));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }

    private void validateTimeSlot(TimeSlot timeSlot) {
        if (timeSlot.getStartTime() != null && timeSlot.getEndTime() != null) {
            if (timeSlot.getStartTime().compareTo(timeSlot.getEndTime()) >= 0) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
        }
    }
}
