// Utility function for conditional className composition
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Helper for combining base styles with conditional ones
export function combineStyles(baseStyle, conditionalStyles = {}) {
  const conditionalClasses = Object.entries(conditionalStyles)
    .filter(([condition, _]) => condition)
    .map(([_, className]) => className)
    .join(' ');
  
  return `${baseStyle} ${conditionalClasses}`.trim();
} 