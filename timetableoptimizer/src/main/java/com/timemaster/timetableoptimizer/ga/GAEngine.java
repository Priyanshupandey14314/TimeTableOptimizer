package com.timemaster.timetableoptimizer.ga;

import com.timemaster.timetableoptimizer.dto.TimeTableRequest;
import com.timemaster.timetableoptimizer.model.*;
import com.timemaster.timetableoptimizer.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GAEngine {

    private final ClassSectionRepository classSectionRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;

    public GAEngine(ClassSectionRepository classSectionRepository,
                   TeacherRepository teacherRepository,
                   SubjectRepository subjectRepository,
                   RoomRepository roomRepository,
                   TimeSlotRepository timeSlotRepository) {
        this.classSectionRepository = classSectionRepository;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
        this.roomRepository = roomRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public Map<String, Object> generateTimetable(TimeTableRequest request) {
        // Fetch required data from database
        ClassSection classSection = classSectionRepository.findById(request.getClassSectionId())
                .orElseThrow(() -> new RuntimeException("ClassSection not found"));

        List<Teacher> teachers = teacherRepository.findAllById(request.getTeacherIds());
        List<Subject> subjects = subjectRepository.findAllById(request.getSubjectIds());
        List<Room> rooms = roomRepository.findAll();
        List<TimeSlot> timeSlots = timeSlotRepository.findAll();

        // Validate data
        if (teachers.isEmpty() || subjects.isEmpty() || rooms.isEmpty() || timeSlots.isEmpty()) {
            throw new RuntimeException("Insufficient data for timetable generation");
        }

        // Create list with single class section
        List<ClassSection> classSections = new ArrayList<>();
        classSections.add(classSection);

        // Initialize Genetic Algorithm
        GeneticAlgorithm ga = new GeneticAlgorithm(classSections, subjects, teachers, rooms, timeSlots);
        
        // Run GA to generate timetable
        Chromosome bestSolution = ga.evolve();

        // Convert chromosome to response format
        return convertToResponse(bestSolution);
    }

    private Map<String, Object> convertToResponse(Chromosome chromosome) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> entries = new ArrayList<>();

        for (Gene gene : chromosome.getGenes()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("classSection", gene.getClassSection().getName());
            entry.put("subject", gene.getSubject().getName());
            entry.put("teacher", gene.getTeacher() != null ? gene.getTeacher().getName() : "N/A");
            entry.put("room", gene.getRoom().getName());
            entry.put("day", gene.getTimeSlot().getDay());
            entry.put("startTime", gene.getTimeSlot().getStartTime());
            entry.put("endTime", gene.getTimeSlot().getEndTime());
            entry.put("periodNumber", gene.getTimeSlot().getPeriodNumber());
            entries.add(entry);
        }

        response.put("timetable", entries);
        response.put("fitness", chromosome.getFitness());
        response.put("message", "Timetable generated successfully");

        return response;
    }
}

