package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.Teacher;
import com.timemaster.timetableoptimizer.services.TeacherService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin("*")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<Teacher> create(@RequestBody Teacher teacher) {
        return org.springframework.http.ResponseEntity.ok(teacherService.addTeacher(teacher));
    }

    @GetMapping
    public org.springframework.http.ResponseEntity<List<Teacher>> getAll() {
        return org.springframework.http.ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Teacher> get(@PathVariable Long id) {
        Teacher teacher = teacherService.getTeacherById(id);
        if (teacher == null) {
            throw new com.timemaster.timetableoptimizer.exception.ResourceNotFoundException(
                    "Teacher not found with id: " + id);
        }
        return org.springframework.http.ResponseEntity.ok(teacher);
    }

    @PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Teacher> update(@PathVariable Long id,
            @RequestBody Teacher teacher) {
        teacher.setId(id);
        return org.springframework.http.ResponseEntity.ok(teacherService.updateTeacher(teacher));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        // Integrity check: Ideally this should be in service, but for now we catch DB
        // errors via GlobalExceptionHandler
        // Or check if teacher has subjects assigned before deleting
        teacherService.deleteTeacher(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
