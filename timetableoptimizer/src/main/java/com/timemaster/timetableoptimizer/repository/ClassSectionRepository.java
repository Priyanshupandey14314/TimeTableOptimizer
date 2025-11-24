package com.timemaster.timetableoptimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.timemaster.timetableoptimizer.model.ClassSection;
public interface ClassSectionRepository extends JpaRepository<ClassSection, Long> {
}

