package com.timemaster.timetableoptimizer.services;


import com.timemaster.timetableoptimizer.model.TimetableEntry;
import com.timemaster.timetableoptimizer.repository.TimetableEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

    private final TimetableEntryRepository timetableEntryRepository;

    public TimetableService(TimetableEntryRepository timetableEntryRepository) {
        this.timetableEntryRepository = timetableEntryRepository;
    }

    public TimetableEntry saveEntry(TimetableEntry entry) {
        return timetableEntryRepository.save(entry);
    }

    public List<TimetableEntry> getAllEntries() {
        return timetableEntryRepository.findAll();
    }

    public void deleteEntry(Long id) {
        timetableEntryRepository.deleteById(id);
    }
}

