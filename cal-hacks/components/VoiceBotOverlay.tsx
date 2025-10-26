import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';

interface VoiceBotOverlayProps {
  isBotSpeaking?: boolean;
  isUserSpeaking?: boolean;
  isActive?: boolean;
  size?: number;
  onStart?: () => void;
  onClose?: () => void;
  post?: any;
}

export function VoiceBotOverlay({ 
  isBotSpeaking = false, 
  isUserSpeaking = true,
  isActive = true,
  size = 100,
  onStart,
  onClose,
  post
}: VoiceBotOverlayProps) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isActive) {
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

  const getColors = () => {
    if (isBotSpeaking) {
      return {
        primary: '#4A90E2', // Blue - Bot speaking
        secondary: '#7ED321', // Green
        glow: '#4A90E2',
      };
    } else if (isUserSpeaking) {
      return {
        primary: '#F5A623', // Orange/Yellow - User listening
        secondary: '#F8E71C', // Yellow
        glow: '#F5A623',
      };
    } else {
      return {
        primary: '#E0E0E0', // Gray - Inactive
        secondary: '#F5F5F5',
        glow: '#CCCCCC',
      };
    }
  };

  const colors = getColors();

  const getStatusText = () => {
    if (isBotSpeaking) return 'AI is analyzing...';
    if (isUserSpeaking) return 'Ready to start';
    return 'Connecting...';
  };

  return (
    <View style={styles.overlay}>
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
        
        {/* Start Button - only show when user is speaking (listening mode) */}
        {isUserSpeaking && !isBotSpeaking && (
          <TouchableOpacity 
            style={styles.startButton}
            onPress={onStart}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        )}
        
        {/* Status Text */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        
        {/* Post Info */}
        {post && (
          <View style={styles.postInfo}>
            <Text style={styles.postInfoText}>
              Analyzing: {post.author.name}'s post
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -100, // Half of the total height to center vertically
    marginLeft: -140, // Half of the total width to center horizontally
    alignItems: 'center',
    justifyContent: 'center',
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
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postInfo: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  postInfoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
