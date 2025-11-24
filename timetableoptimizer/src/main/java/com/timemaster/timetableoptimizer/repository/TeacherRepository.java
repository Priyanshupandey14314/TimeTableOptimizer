package com.timemaster.timetableoptimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.timemaster.timetableoptimizer.model.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
