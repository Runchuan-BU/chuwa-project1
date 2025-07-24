// Common reusable styles across the application
export const commonStyles = {
  // Layout
  container: "max-w-4xl mx-auto mt-10 p-6",
  containerLarge: "max-w-6xl mx-auto mt-10",
  section: "mt-8 bg-gray-50 rounded-lg p-6",
  
  // Typography
  title: "text-2xl font-bold mb-6",
  subtitle: "text-lg font-semibold mb-4",
  bodyText: "text-gray-600",
  errorText: "text-red-500 text-sm mt-1",
  successText: "text-green-700",
  helpText: "text-sm text-gray-600",
  
  // Buttons
  btnPrimary: "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors",
  btnSecondary: "bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors",
  btnDanger: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors",
  btnDisabled: "disabled:bg-blue-400 disabled:cursor-not-allowed",
  
  // Forms
  input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  inputError: "w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  label: "block text-sm font-medium text-gray-700 mb-1",
  
  // Cards
  card: "bg-white rounded-lg shadow-md p-6",
  cardHover: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow",
  
  // States
  loading: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600",
  emptyState: "text-center py-12",
  
  // Navigation
  navLink: "text-gray-700 hover:text-blue-600 transition-colors",
  activeNavLink: "text-blue-600 font-medium",
  
  // Grid & Layout
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  flexBetween: "flex justify-between items-center",
  flexCenter: "flex justify-center items-center",
  
  // Utilities
  shadow: "shadow-md",
  rounded: "rounded-lg",
  transition: "transition-colors",
};

// Button variants
export const buttonVariants = {
  primary: commonStyles.btnPrimary,
  secondary: commonStyles.btnSecondary,
  danger: commonStyles.btnDanger,
  outline: "border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors",
};

// Input variants
export const inputVariants = {
  default: commonStyles.input,
  error: commonStyles.inputError,
  disabled: commonStyles.input + " disabled:bg-gray-100 disabled:cursor-not-allowed",
};

// Card variants
export const cardVariants = {
  default: commonStyles.card,
  hover: commonStyles.cardHover,
  bordered: "bg-white rounded-lg border border-gray-200 p-6",
}; 