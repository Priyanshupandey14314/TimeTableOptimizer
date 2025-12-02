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
    public TimeSlot add(@RequestBody TimeSlot timeSlot) {
        return timeSlotService.addTimeSlot(timeSlot);
    }

    @GetMapping
    public List<TimeSlot> getAll() {
        return timeSlotService.getAllTimeSlots();
    }

    @GetMapping("/{id}")
    public TimeSlot get(@PathVariable Long id) {
        return timeSlotService.getTimeSlotById(id);
    }

    @PutMapping("/{id}")
    public TimeSlot update(@PathVariable Long id, @RequestBody TimeSlot timeSlot) {
        return timeSlotService.updateTimeSlot(id, timeSlot);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
    }
}

