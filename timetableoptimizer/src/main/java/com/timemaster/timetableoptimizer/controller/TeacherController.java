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
    public Teacher create(@RequestBody Teacher teacher) {
        return teacherService.addTeacher(teacher);
    }

    @GetMapping
    public List<Teacher> getAll() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public Teacher get(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    @PutMapping("/{id}")
    public Teacher update(@PathVariable Long id, @RequestBody Teacher teacher) {
        // Ensure the ID in the path matches the ID in the body if necessary,
        // or just pass to service which seems to use save() for update.
        // Ideally we should set the ID on the object to be sure.
        teacher.setId(id);
        return teacherService.updateTeacher(teacher);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
    }
}
