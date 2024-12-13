import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { styles } from './styles';

export function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}