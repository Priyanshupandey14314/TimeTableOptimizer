package com.timemaster.timetableoptimizer.repository;

import com.timemaster.timetableoptimizer.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findByClassSectionId(Long classSectionId);

    List<TimetableEntry> findByTeacherId(Long teacherId);
}
