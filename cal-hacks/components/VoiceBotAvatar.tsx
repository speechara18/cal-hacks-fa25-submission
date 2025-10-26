import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface VoiceBotAvatarProps {
  isBotSpeaking?: boolean;
  isUserSpeaking?: boolean;
  isActive?: boolean;
  size?: number;
}

export function VoiceBotAvatar({ 
  isBotSpeaking = false, 
  isUserSpeaking = false, 
  isActive = false,
  size = 120 
}: VoiceBotAvatarProps) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isActive) {
      // Create pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, pulseAnim]);

  // Determine colors based on state
  const getColors = () => {
    if (isBotSpeaking) {
      return {
        primary: '#4A90E2', // Blue
        secondary: '#7ED321', // Green
        glow: '#4A90E2',
      };
    } else if (isUserSpeaking) {
      return {
        primary: '#F5A623', // Orange
        secondary: '#F8E71C', // Yellow
        glow: '#F5A623',
      };
    } else {
      return {
        primary: '#E0E0E0', // Light gray
        secondary: '#F5F5F5', // Very light gray
        glow: '#CCCCCC',
      };
    }
  };

  const colors = getColors();

  return (
    <View style={styles.container}>
      {/* Outer glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            transform: [{ scale: pulseAnim }],
            backgroundColor: colors.glow,
            opacity: isActive ? 0.3 : 0,
          }
        ]}
      />
      
      {/* Main avatar circle */}
      <Animated.View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulseAnim }],
            backgroundColor: colors.primary,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
