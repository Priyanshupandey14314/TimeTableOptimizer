package com.timemaster.timetableoptimizer.ga;

import com.timemaster.timetableoptimizer.model.*;
import java.util.*;

public class Population {

    private List<Chromosome> chromosomes;
    private int size;

    public Population(int size, List<ClassSection> classSections,
                     List<Subject> subjects, List<Teacher> teachers,
                     List<Room> rooms, List<TimeSlot> timeSlots) {
        this.size = size;
        this.chromosomes = new ArrayList<>();

        // Initialize population with random chromosomes
        for (int i = 0; i < size; i++) {
            chromosomes.add(new Chromosome(classSections, subjects, teachers, rooms, timeSlots));
        }

        // Calculate fitness for all chromosomes
        calculateFitness();
    }

    public Population(List<Chromosome> chromosomes) {
        this.chromosomes = chromosomes;
        this.size = chromosomes.size();
        calculateFitness();
    }

    public void calculateFitness() {
        for (Chromosome chromosome : chromosomes) {
            double fitness = FitnessCalculator.calculateFitness(chromosome);
            chromosome.setFitness(fitness);
        }
        // Sort by fitness (descending - higher is better)
        chromosomes.sort((a, b) -> Double.compare(b.getFitness(), a.getFitness()));
    }

    public Chromosome getFittest() {
        if (chromosomes.isEmpty()) {
            return null;
        }
        return chromosomes.get(0); // Already sorted, first is fittest
    }

    public List<Chromosome> getChromosomes() {
        return chromosomes;
    }

    public int getSize() {
        return size;
    }

    public Chromosome getChromosome(int index) {
        return chromosomes.get(index);
    }

    public void setChromosome(int index, Chromosome chromosome) {
        chromosomes.set(index, chromosome);
    }

    // Tournament selection - select a chromosome based on fitness
    public Chromosome tournamentSelect(int tournamentSize) {
        Random random = new Random();
        List<Chromosome> tournamentChromosomes = new ArrayList<>();
        
        for (int i = 0; i < tournamentSize && i < chromosomes.size(); i++) {
            int randomIndex = random.nextInt(chromosomes.size());
            tournamentChromosomes.add(chromosomes.get(randomIndex));
        }
        
        // Find fittest in tournament
        Chromosome fittest = tournamentChromosomes.get(0);
        for (Chromosome chromosome : tournamentChromosomes) {
            if (chromosome.getFitness() > fittest.getFitness()) {
                fittest = chromosome;
            }
        }
        
        return fittest;
    }
}
