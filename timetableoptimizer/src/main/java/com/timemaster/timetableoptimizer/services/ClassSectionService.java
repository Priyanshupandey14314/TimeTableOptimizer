package com.timemaster.timetableoptimizer.services;

import com.timemaster.timetableoptimizer.model.ClassSection;
import com.timemaster.timetableoptimizer.repository.ClassSectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassSectionService {

    private final ClassSectionRepository classSectionRepository;

    public ClassSectionService(ClassSectionRepository classSectionRepository) {
        this.classSectionRepository = classSectionRepository;
    }

    public ClassSection addClassSection(ClassSection classSection) {
        return classSectionRepository.save(classSection);
    }

    public List<ClassSection> getAllClassSections() {
        return classSectionRepository.findAll();
    }

    public ClassSection getClassSectionById(Long id) {
        return classSectionRepository.findById(id).orElse(null);
    }

    public ClassSection updateClassSection(Long id, ClassSection classSection) {
        return classSectionRepository.save(classSection);
    }

    public void deleteClassSection(Long id) {
        classSectionRepository.deleteById(id);
    }
}

