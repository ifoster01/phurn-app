import React, { createContext, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Sport = 'UFC' | 'NFL'

type SportSelectionContextType = {
  selectedSport: Sport
  setSelectedSport: (sport: Sport) => void
}

const STORAGE_KEY = '@sport_selection'
const SportSelectionContext = createContext<SportSelectionContextType | undefined>(undefined)

export const SportSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSport, setSelectedSport] = React.useState<Sport>('UFC')
  const [isLoading, setIsLoading] = React.useState(true)

  // Load saved preference
  React.useEffect(() => {
    const loadSavedSport = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY)
        if (saved === 'UFC' || saved === 'NFL') {
          setSelectedSport(saved)
        }
      } catch (error) {
        console.warn('Error loading sport preference:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSavedSport()
  }, [])

  const handleSportChange = React.useCallback(async (sport: Sport) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, sport)
      setSelectedSport(sport)
    } catch (error) {
      console.warn('Error saving sport preference:', error)
    }
  }, [])

  if (isLoading) {
    return null // Or a loading spinner
  }

  return (
    <SportSelectionContext.Provider 
      value={{ 
        selectedSport, 
        setSelectedSport: handleSportChange 
      }}
    >
      {children}
    </SportSelectionContext.Provider>
  )
}

export const useSportSelection = () => {
  const context = useContext(SportSelectionContext)
  if (!context) {
    throw new Error('useSportSelection must be used within a SportSelectionProvider')
  }
  return context
} 