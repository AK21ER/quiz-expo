import { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const bannerImage = require('../../assets/images/quiz_banner.png');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.titleText}>QuizMaster</Text>
          </Animated.View>

          <Animated.View style={[styles.bannerContainer, { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}>
            <Image 
              source={bannerImage} 
              style={styles.banner}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(15, 23, 42, 0.8)']}
              style={styles.overlay}
            />
          </Animated.View>

          <Animated.View style={[styles.descriptionCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.cardTitle}>Test Your Knowledge</Text>
            <Text style={styles.cardDescription}>
              Challenge yourself with 5 expert-curated questions covering Science, Geography, History, and more. 
              Can you master all categories and achieve a perfect score?
            </Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>5</Text>
                <Text style={styles.infoLabel}>Questions</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>ALL</Text>
                <Text style={styles.infoLabel}>Topics</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoValue}>FREE</Text>
                <Text style={styles.infoLabel}>Always</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity 
              style={styles.startButtonWrapper} 
              onPress={() => router.push('/test')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#38BDF8', '#818CF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Start Quiz Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  titleText: {
    color: '#F8FAFC',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: -4,
  },
  bannerContainer: {
    height: 240,
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 20,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  banner: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  descriptionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 32,
    padding: 28,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  cardDescription: {
    color: '#94A3B8',
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 20,
    borderRadius: 24,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoValue: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#334155',
  },
  startButtonWrapper: {
    width: '100%',
  },
  startButton: {
    paddingVertical: 22,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

