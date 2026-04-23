package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private ClassSectionRepository classSectionRepository;
    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("teachers", teacherRepository.count());
        stats.put("subjects", subjectRepository.count());
        stats.put("rooms", roomRepository.count());
        stats.put("classes", classSectionRepository.count());
        stats.put("timeSlots", timeSlotRepository.count());
        return stats;
    }
}
