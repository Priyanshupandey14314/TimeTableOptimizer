package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.Subject;
import com.timemaster.timetableoptimizer.services.SubjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin("*")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<Subject> create(@RequestBody Subject subject) {
        if (subject.getWeeklyHours() <= 0) {
            // throw new IllegalArgumentException("Weekly hours must be positive");
            // Relaxed for now or handle as warning
        }
        return org.springframework.http.ResponseEntity.ok(subjectService.addSubject(subject));
    }

    @GetMapping
    public org.springframework.http.ResponseEntity<List<Subject>> getAll() {
        return org.springframework.http.ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Subject> get(@PathVariable Long id) {
        Subject s = subjectService.getSubjectById(id);
        if (s == null) {
            throw new com.timemaster.timetableoptimizer.exception.ResourceNotFoundException(
                    "Subject not found with id: " + id);
        }
        return org.springframework.http.ResponseEntity.ok(s);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Subject> update(@PathVariable Long id,
            @RequestBody Subject subject) {
        return org.springframework.http.ResponseEntity.ok(subjectService.updateSubject(id, subject));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
