package com.timemaster.timetableoptimizer.services;

import com.timemaster.timetableoptimizer.model.TimeSlot;
import com.timemaster.timetableoptimizer.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotService(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }

    // CREATE
    public TimeSlot addTimeSlot(TimeSlot timeSlot) {
        return timeSlotRepository.save(timeSlot);
    }

    // GET ALL
    public List<TimeSlot> getAllTimeSlots() {
        return timeSlotRepository.findAll();
    }

    // GET BY ID
    public TimeSlot getTimeSlotById(Long id) {
        return timeSlotRepository.findById(id).orElse(null);
    }

    // UPDATE
    public TimeSlot updateTimeSlot(Long id, TimeSlot updatedSlot) {
        return timeSlotRepository.findById(id)
                .map(existing -> {
                    existing.setDay(updatedSlot.getDay());
                    existing.setStartTime(updatedSlot.getStartTime());
                    existing.setEndTime(updatedSlot.getEndTime());
                    return timeSlotRepository.save(existing);
                })
                .orElse(null);
    }

    // DELETE
    public boolean deleteTimeSlot(Long id) {
        if (timeSlotRepository.existsById(id)) {
            timeSlotRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
