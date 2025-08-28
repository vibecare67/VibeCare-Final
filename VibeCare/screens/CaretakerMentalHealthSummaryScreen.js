import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const API_BASE_URL = `${API_BASE_URL}`;

const CaretakerMentalHealthSummaryScreen = ({ route }) => {
  const { userId, userName } = route.params;
  const [depressionResult, setDepressionResult] = useState(null);
  const [anxietyResult, setAnxietyResult] = useState(null);
  const [stressResult, setStressResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
  console.log("📌 CaretakerMentalHealthSummaryScreen userId:", userId);
}, [userId]);


  const fetchLatestDepressionResult = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-latest-result?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setDepressionResult(data.result); // store full object
      } else {
        setDepressionResult(null);
      }
    } catch (err) {
      console.error("Error fetching depression result:", err);
      setDepressionResult(null);
    }
  };

  const fetchLatestAnxietyResult = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-latest-anxiety-result?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setAnxietyResult(data.result); // store full object
      } else {
        setAnxietyResult(null);
      }
    } catch (err) {
      console.error("Error fetching anxiety result:", err);
      setAnxietyResult(null);
    }
  };

  const fetchLatestStressResult = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stress-result/latest/${userId}`);
      const data = await response.json();
      if (response.ok && data.status === "success") {
        setStressResult(data.data); // store full object
      } else {
        setStressResult(null);
      }
    } catch (err) {
      console.error("Error fetching stress result:", err);
      setStressResult(null);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([
          fetchLatestDepressionResult(),
          fetchLatestAnxietyResult(),
          fetchLatestStressResult()
        ]);
      } catch (err) {
        setError("Failed to load mental health data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#610d1b" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{userName}'s Mental Health Overview</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Summary</Text>
        <ResultCard
          label="Depression Level"
          value={depressionResult ? depressionResult.depression_level : "No data"}
          color="#F7C7C7"
        />
        <ResultCard
          label="Anxiety Level"
          value={anxietyResult ? anxietyResult.anxiety_level : "No data"}
          color="#CBF5D3"
        />
        <ResultCard
          label="Stress Level"
          value={stressResult ? stressResult.stress_level : "No data"}
          color="#D6C6F7"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scores</Text>
        <ResultCard
          label="BDI Score (Depression)"
          value={depressionResult ? depressionResult.bdi_score : "No data"}
          color="#FFE0E0"
        />
        <ResultCard
          label="BAI Score (Anxiety)"
          value={anxietyResult ? anxietyResult.bai_score : "No data"}
          color="#E0FFE0"
        />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  noRecordsText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#610d1b',
    marginBottom: 20,
    marginTop: 30,
    left: 10,
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
