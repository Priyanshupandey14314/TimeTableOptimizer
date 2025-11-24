package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.ClassSection;
import com.timemaster.timetableoptimizer.services.ClassSectionService;
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
    public ClassSection create(@RequestBody ClassSection c) {
        return classSectionService.addClassSection(c);
    }

    @GetMapping
    public List<ClassSection> getAll() {
        return classSectionService.getAllClassSections();
    }

    @GetMapping("/{id}")
    public ClassSection get(@PathVariable Long id) {
        return classSectionService.getClassSectionById(id);
    }

    @PutMapping("/{id}")
    public ClassSection update(@PathVariable Long id, @RequestBody ClassSection c) {
        return classSectionService.updateClassSection(id, c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        classSectionService.deleteClassSection(id);
    }
}

