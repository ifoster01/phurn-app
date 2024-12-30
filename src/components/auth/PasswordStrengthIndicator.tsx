import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { MotiView } from 'moti'

type Requirement = {
  label: string
  regex: RegExp
  met: boolean
}

export const PasswordStrengthIndicator = ({ password = '' }: { password: string }) => {
  const requirements = useMemo(() => {
    const reqs: Requirement[] = [
      {
        label: 'At least 8 characters',
        regex: /.{8,}/,
        met: false
      },
      {
        label: 'Contains uppercase letter',
        regex: /[A-Z]/,
        met: false
      },
      {
        label: 'Contains number',
        regex: /[0-9]/,
        met: false
      },
      {
        label: 'Contains special character',
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        met: false
      }
    ]

    return reqs.map(req => ({
      ...req,
      met: req.regex.test(password)
    }))
  }, [password])

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length
    return (metCount / requirements.length) * 100
  }, [requirements])

  const colors = {
    weak: '#B3261E',
    medium: '#F2B705',
    strong: '#146C2E',
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <MotiView
          animate={{
            width: `${Math.max(0, Math.min(100, strength))}%`,
            backgroundColor: strength < 50 
              ? colors.weak
              : strength < 75
                ? colors.medium
                : colors.strong
          }}
          transition={{
            type: 'timing',
            duration: 300
          }}
          style={styles.progress}
        />
      </View>
      <View style={styles.requirements}>
        {requirements.map((req, index) => (
          <View key={index} style={styles.requirement}>
            <View 
              style={[
                styles.dot,
                { backgroundColor: req.met ? colors.strong : colors.weak }
              ]} 
            />
            <Text 
              variant="bodySmall"
              style={[
                styles.requirementText,
                { color: req.met ? colors.strong : colors.weak }
              ]}
            >
              {req.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  bar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  requirements: {
    marginTop: 8,
    gap: 4,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  requirementText: {
    fontSize: 12,
  },
}) 