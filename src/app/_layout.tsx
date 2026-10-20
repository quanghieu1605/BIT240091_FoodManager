/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * ROOT NAVIGATION & LAYOUT
 * Dynamic bilingual header titles per current language selection
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FoodProvider, useFood } from '@/context/FoodContext';

/**
 * Inner navigator that can read language from context
 * to produce fully bilingual header titles (Section 4.5)
 */
function AppNavigator() {
  const { t } = useFood();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#1E293B',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#F8FAFC',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="dish/[id]"
        options={{
          title: t.dishDetailTitle,
          headerBackTitle: t.back,
        }}
      />
      <Stack.Screen
        name="dish/create"
        options={{
          title: t.createDishTitle,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="dish/edit/[id]"
        options={{
          title: t.editDishTitle,
          headerBackTitle: t.back,
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: t.categoriesTitle,
          headerBackTitle: t.back,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: t.settingsTitle,
          headerBackTitle: t.back,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <FoodProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </FoodProvider>
  );
}
