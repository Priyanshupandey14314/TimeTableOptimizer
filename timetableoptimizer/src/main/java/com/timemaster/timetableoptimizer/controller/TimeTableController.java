package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.dto.TimeTableRequest;
import com.timemaster.timetableoptimizer.ga.GAEngine;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin("*")
public class TimeTableController {

    private final GAEngine gaEngine;

    public TimeTableController(GAEngine gaEngine) {
        this.gaEngine = gaEngine;
    }

    @PostMapping("/generate")
    public Object generate(@RequestBody TimeTableRequest request) {
        return gaEngine.generateTimetable(request);
    }
}
