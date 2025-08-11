import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const mockHistory = [
  {
    date: '2025-06-21',
    depression: 'Extreme depression',
    anxiety: 'Low Anxiety Level',
    stress: 'Low Stress',
  },
  {
    date: '2025-06-12',
    depression: 'Moderate depression',
    anxiety: 'Moderate Anxiety',
    stress: 'Medium Stress',
  },
  {
    date: '2025-06-07',
    depression: 'Mild Mood Disturbance',
    anxiety: 'Mild Anxiety',
    stress: 'Low Stress',
  },
];

const CaretakerMentalHealthSummaryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Arooj's Mental Health Overview</Text>

      {/* Latest Result */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Summary (June 15, 2025)</Text>
        <ResultCard label="Depression Level" value="Extreme depression" color="#F7C7C7" />
        <ResultCard label="Anxiety Level" value="Low Anxiety Level" color="#CBF5D3" />
        <ResultCard label="Stress Level" value="Low Stress" color="#D6C6F7" />
      </View>

      {/* Previous Entries */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Records</Text>
        {mockHistory.slice(1).map((item, index) => (
          <View key={index} style={styles.recordCard}>
            <Text style={styles.recordDate}>{item.date}</Text>
            <Text style={styles.recordText}>🧠 Depression: {item.depression}</Text>
            <Text style={styles.recordText}>😟 Anxiety: {item.anxiety}</Text>
            <Text style={styles.recordText}>🔥 Stress: {item.stress}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const ResultCard = ({ label, value, color }) => (
  <View style={[styles.resultCard, { backgroundColor: color }]}>
    <Text style={styles.resultLabel}>{label}</Text>
    <Text style={styles.resultValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE9E6',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#610d1b',
    marginBottom: 20,
    marginTop:30,
    left:10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B3B3B',
    marginBottom: 12,
  },
  resultCard: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E2E2E',
  },
  resultValue: {
    fontSize: 16,
    color: '#4F4F4F',
    marginTop: 4,
  },
  recordCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recordDate: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  recordText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

export default CaretakerMentalHealthSummaryScreen;
