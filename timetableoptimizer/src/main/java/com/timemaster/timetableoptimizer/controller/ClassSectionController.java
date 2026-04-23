package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.ClassSection;
import com.timemaster.timetableoptimizer.exception.ResourceNotFoundException;
import com.timemaster.timetableoptimizer.services.ClassSectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classsections")
@CrossOrigin("*")
public class ClassSectionController {

    private final ClassSectionService classSectionService;

    public ClassSectionController(ClassSectionService classSectionService) {
        this.classSectionService = classSectionService;
    }

    @PostMapping
    public ResponseEntity<ClassSection> add(@RequestBody ClassSection classSection) {
        if (classSection.getStudentCount() < 0) {
            throw new IllegalArgumentException("Student count cannot be negative");
        }
        return ResponseEntity.ok(classSectionService.addClassSection(classSection));
    }

    @GetMapping
    public ResponseEntity<List<ClassSection>> getAll() {
        return ResponseEntity.ok(classSectionService.getAllClassSections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassSection> get(@PathVariable Long id) {
        ClassSection cs = classSectionService.getClassSectionById(id);
        if (cs == null) {
            throw new ResourceNotFoundException("ClassSection not found with id: " + id);
        }
        return ResponseEntity.ok(cs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassSection> update(@PathVariable Long id, @RequestBody ClassSection classSection) {
        if (classSection.getStudentCount() < 0) {
            throw new IllegalArgumentException("Student count cannot be negative");
        }
        return ResponseEntity.ok(classSectionService.updateClassSection(id, classSection));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classSectionService.deleteClassSection(id);
        return ResponseEntity.noContent().build();
    }
}
