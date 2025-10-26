import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

export type PlatformMode = 'twitter' | 'instagram' | 'facebook';

interface PlatformSelectorProps {
  selectedMode: PlatformMode;
  onModeChange: (mode: PlatformMode) => void;
}

export function PlatformSelector({ selectedMode, onModeChange }: PlatformSelectorProps) {
  const platforms = [
    { id: 'twitter' as PlatformMode, name: 'Twitter', icon: '🐦' },
    { id: 'instagram' as PlatformMode, name: 'Instagram', icon: '📷' },
    { id: 'facebook' as PlatformMode, name: 'Facebook', icon: '👥' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Choose Platform</ThemedText>
      <View style={styles.platformList}>
        {platforms.map((platform) => (
          <TouchableOpacity
            key={platform.id}
            style={[
              styles.platformButton,
              selectedMode === platform.id && styles.selectedPlatform
            ]}
            onPress={() => onModeChange(platform.id)}
            accessibilityLabel={`Switch to ${platform.name} mode`}
            accessibilityRole="button"
          >
            <Text style={styles.platformIcon}>{platform.icon}</Text>
            <ThemedText style={[
              styles.platformName,
              selectedMode === platform.id && styles.selectedPlatformText
            ]}>
              {platform.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000',
  },
  platformList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  platformButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlatform: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
  },
  platformIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  platformName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#657786',
  },
  selectedPlatformText: {
    color: '#FFFFFF',
  },
});
