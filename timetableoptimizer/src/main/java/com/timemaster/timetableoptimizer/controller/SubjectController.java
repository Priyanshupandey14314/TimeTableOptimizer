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
    public Subject create(@RequestBody Subject subject) {
        System.out.println("Received Subject: " + subject);
        if (subject.getTeacher() != null) {
            System.out.println("Teacher ID: " + subject.getTeacher().getId());
        } else {
            System.out.println("Teacher is null");
        }
        return subjectService.addSubject(subject);
    }

    @GetMapping
    public List<Subject> getAll() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public Subject get(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    @PutMapping("/{id}")
    public Subject update(@PathVariable Long id, @RequestBody Subject subject) {
        return subjectService.updateSubject(id, subject);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}
