package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.dto.TimeTableRequest;
import com.timemaster.timetableoptimizer.ga.GAEngine;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin("*")
public class TimeTableController {

    private final GAEngine gaEngine;
    private final com.timemaster.timetableoptimizer.repository.TimetableEntryRepository timetableEntryRepository;

    public TimeTableController(GAEngine gaEngine,
            com.timemaster.timetableoptimizer.repository.TimetableEntryRepository timetableEntryRepository) {
        this.gaEngine = gaEngine;
        this.timetableEntryRepository = timetableEntryRepository;
    }

    @PostMapping("/generate")
    public org.springframework.http.ResponseEntity<Object> generate(@RequestBody TimeTableRequest request) {
        return org.springframework.http.ResponseEntity.ok(gaEngine.generateTimetable(request));
    }

    @GetMapping("/class/{classId}")
    public org.springframework.http.ResponseEntity<java.util.List<com.timemaster.timetableoptimizer.model.TimetableEntry>> getByClass(
            @PathVariable Long classId) {
        return org.springframework.http.ResponseEntity.ok(timetableEntryRepository.findByClassSectionId(classId));
    }

    @GetMapping("/teacher/{teacherId}")
    public org.springframework.http.ResponseEntity<java.util.List<com.timemaster.timetableoptimizer.model.TimetableEntry>> getByTeacher(
            @PathVariable Long teacherId) {
        return org.springframework.http.ResponseEntity.ok(timetableEntryRepository.findByTeacherId(teacherId));
    }
}
