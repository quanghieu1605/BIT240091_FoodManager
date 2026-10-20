/**
 * MSSV: BIT240091
 * PROJECT: BIT240091_FoodManager
 * ROOT NAVIGATION & LAYOUT
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FoodProvider } from '@/context/FoodContext';

export default function RootLayout() {
  return (
    <FoodProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#1E293B',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
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
            title: 'Dish Details',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="dish/create"
          options={{
            title: 'Add New Dish',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="dish/edit/[id]"
          options={{
            title: 'Edit Dish',
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            title: 'Categories',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings & Sync',
          }}
        />
      </Stack>
    </FoodProvider>
  );
}
