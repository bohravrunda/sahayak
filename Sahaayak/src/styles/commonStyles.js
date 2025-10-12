import { StyleSheet } from "react-native";
import colors from '../styles/colors';


export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.text,
    marginBottom: 30,
  },
  singleInput: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    minHeight: 50,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    minHeight: 50,
  },
  iconContainer: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12 },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: colors.accent,
    fontSize: 14,
  },
});
