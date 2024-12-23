import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export function SafeAreaWrapper({ children }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -34,
    backgroundColor: '#FFFFFF',
  },
});