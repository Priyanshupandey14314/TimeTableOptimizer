package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.model.Department;
import com.timemaster.timetableoptimizer.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin("*")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public org.springframework.http.ResponseEntity<List<Department>> getAll() {
        return org.springframework.http.ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<Department> create(@RequestBody Department department) {
        return org.springframework.http.ResponseEntity.ok(departmentRepository.save(department));
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentRepository.deleteById(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
