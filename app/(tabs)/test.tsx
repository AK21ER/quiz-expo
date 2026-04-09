import { StyleSheet, TouchableOpacity, Text, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { question } from '@/data/question';
import { useEffect, useRef, useState } from 'react';

export default function TestScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<typeof question>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    startAnimation();
  }, [currentQuestionIndex, isFinished, selectedCategory]);

  const startAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSelectCategory = (category: string) => {
    const filtered = question.filter(q => q.category === category);
    setFilteredQuestions(filtered);
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
  };

  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(option);
    const isCorrect = option === filteredQuestions[currentQuestionIndex].answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setSelectedOption(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  const progress = filteredQuestions.length > 0 ? ((currentQuestionIndex + 1) / filteredQuestions.length) * 100 : 0;

  // 1. Category Selection View
  if (!selectedCategory) {
    const categories = [
      { name: 'Science', icon: 'atom', colors: ['#0EA5E9', '#2563EB'], image: require('../../assets/images/science_cat.png') },
      { name: 'History', icon: 'book.closed.fill', colors: ['#F59E0B', '#D97706'], image: require('../../assets/images/history_cat.png') },
      { name: 'Geography', icon: 'globe.americas.fill', colors: ['#10B981', '#059669'], image: require('../../assets/images/geography_cat.png') },
      { name: 'General', icon: 'lightbulb.fill', colors: ['#8B5CF6', '#7C3AED'], image: require('../../assets/images/general_cat.png') },
    ];

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.categoryContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.categoryTitle}>Choose a Category</Text>
            <Text style={styles.categorySubtitle}>Select a topic to start your quiz</Text>
            
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat.name} 
                  style={styles.categoryCardWrapper}
                  onPress={() => handleSelectCategory(cat.name)}
                >
                  <View style={styles.categoryCard}>
                    <Image source={cat.image} style={StyleSheet.absoluteFill} contentFit="cover" />
                    <LinearGradient 
                      colors={['transparent', 'rgba(15, 23, 42, 0.8)']} 
                      style={StyleSheet.absoluteFill} 
                    />
                    <View style={styles.categoryInfo}>
                      <IconSymbol name={cat.icon as any} size={32} color="#FFFFFF" />
                      <Text style={styles.categoryName}>{cat.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  // 2. Quiz Results View
  if (isFinished) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.resultsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient colors={['#38BDF8', '#818CF8']} style={styles.trophyContainer}>
              <IconSymbol size={80} name="trophy.fill" color="#FFFFFF" />
            </LinearGradient>
            
            <Text style={styles.resultsTitle}>Quiz Finished!</Text>
            <Text style={styles.resultsCategory}>{selectedCategory} Master</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Final Score</Text>
              <Text style={styles.scoreValue}>{score} / {filteredQuestions.length}</Text>
            </View>
            
            <TouchableOpacity activeOpacity={0.8} style={[styles.bottomButton, { marginBottom: 12 }]} onPress={restartQuiz}>
              <LinearGradient colors={['#38BDF8', '#0EA5E9']} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={styles.bottomButton} onPress={goBackToCategories}>
              <View style={[styles.gradientButton, { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' }]}>
                <Text style={[styles.buttonText, { color: '#94A3B8' }]}>Change Category</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  // 3. Main Quiz View
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBackToCategories} style={styles.backLink}>
             <IconSymbol name="chevron.left" size={20} color="#94A3B8" />
             <Text style={styles.backText}>{selectedCategory}</Text>
          </TouchableOpacity>
          <View style={styles.headerTop}>
            <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</Text>
            <Text style={styles.scoreTicker}>Score: {score}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>
        
        <Animated.View style={[styles.quizContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{filteredQuestions[currentQuestionIndex].question}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {filteredQuestions[currentQuestionIndex].options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === filteredQuestions[currentQuestionIndex].answer;
              const isWrong = isSelected && !isCorrect;
              const showResult = selectedOption !== null;

              let buttonStyle: any = styles.optionButton;
              let letterContainerStyle: any = styles.optionLetterContainer;
              
              if (showResult) {
                if (isCorrect) {
                  buttonStyle = [styles.optionButton, styles.optionCorrect];
                  letterContainerStyle = [styles.optionLetterContainer, { backgroundColor: '#22C55E20' }];
                } else if (isWrong) {
                  buttonStyle = [styles.optionButton, styles.optionWrong];
                  letterContainerStyle = [styles.optionLetterContainer, { backgroundColor: '#EF444420' }];
                }
              }

              return (
                <TouchableOpacity 
                  key={index} 
                  style={buttonStyle} 
                  onPress={() => handleAnswer(option)}
                  activeOpacity={showResult ? 1 : 0.7}
                  disabled={showResult}
                >
                  <View style={letterContainerStyle}>
                    <Text style={[styles.optionLetter, showResult && isCorrect && { color: '#22C55E' }, showResult && isWrong && { color: '#EF4444' }]}>
                      {String.fromCharCode(64 + index + 1)}
                    </Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                  {showResult && isCorrect && <IconSymbol name="checkmark.circle.fill" size={20} color="#22C55E" />}
                  {showResult && isWrong && <IconSymbol name="xmark.circle.fill" size={20} color="#EF4444" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedOption && (
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={handleNext}>
              <LinearGradient
                colors={['#38BDF8', '#0EA5E9']}
                style={styles.nextButton}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex === filteredQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Text>
                <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  scoreTicker: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },
  quizContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: '#1E293B',
    padding: 30,
    borderRadius: 28,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 34,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionLetterContainer: {
    width: 38,
    height: 38,
    backgroundColor: '#38BDF815',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionLetter: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  resultsCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  trophyContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  resultsTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  scoreContainer: {
    backgroundColor: '#1E293B',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: '900',
    color: '#38BDF8',
  },
  feedbackText: {
    fontSize: 18,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 30,
  },
  restartButtonWrapper: {
    width: '100%',
  },
  restartButton: {
    paddingVertical: 20,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optionCorrect: {
    borderColor: '#22C55E',
    backgroundColor: '#14532D50',
  },
  optionWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#7F1D1D50',
  },
  nextButtonWrapper: {
    marginTop: 30,
    width: '100%',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  categoryContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  categorySubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 40,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  categoryCardWrapper: {
    width: '47%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  categoryCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  backText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCategory: {
    fontSize: 18,
    color: '#38BDF8',
    fontWeight: '700',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomButton: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
