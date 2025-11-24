package com.timemaster.timetableoptimizer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.timemaster.timetableoptimizer.model.TimeSlot;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
}
