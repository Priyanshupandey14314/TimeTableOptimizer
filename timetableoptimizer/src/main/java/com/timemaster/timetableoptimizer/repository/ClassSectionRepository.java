package com.timemaster.timetableoptimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.timemaster.timetableoptimizer.model.ClassSection;
import java.util.List;

public interface ClassSectionRepository extends JpaRepository<ClassSection, Long> {
    List<ClassSection> findByDepartment(String department);
}
