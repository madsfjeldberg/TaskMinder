import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },

  // Text styles
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: '#666',
  },

  // Card styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  cardContent: {
    fontSize: 14,
    color: '#666',
  },

  // Button styles
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // List styles
  list: {
    marginBottom: 16,
  },

  listItem: {
    padding: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  // Form styles
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },

  // Utility classes
  mt16: {
    marginTop: 16,
  },

  mb16: {
    marginBottom: 16,
  },

  p16: {
    padding: 16,
  },

  textCenter: {
    textAlign: 'center',
  },

  flexRow: {
    flexDirection: 'row',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  alignCenter: {
    alignItems: 'center',
  },
});

export default styles;