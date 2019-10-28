export default {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    flexDirection: 'column',
    justifyContent: "flex-end",
    alignItems: 'center',
  },
  contentContainer: {
    width: "98%",
    
    padding: 16,
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
  },
  logo: {
    margin: 24,
  },
  heading: {
    textAlign: 'center',
    color: 'rgba(255,255,255, 0.95)',
    fontSize: 16,
  },
  title: {
    textAlign: 'center',
    color: 'rgba(255,255,255, 0.95)',
    fontSize: 24,
    padding: 24,
    paddingBottom: 12
  },
  description: (error) => ({
    textAlign: 'center',
    color: error ? '#ef9a9a' : 'rgba(255,255,255, 0.60)',
    height: 65,
    fontSize: 16,
    marginVertical: 10,
    marginHorizontal: 20,
  }),
  buttonContainer: {
    padding: 20,
  },
  buttonText: {
    color: '#8fbc5a',
    fontSize: 15,
    fontWeight: 'bold',
  },
};
