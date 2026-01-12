/**
 * Root App Component
 */

import { AppRouter } from "./routes";
import { useDarkMode } from "./lib/hooks";

function App() {
  // Initialize dark mode (applies on mount)
  useDarkMode();

  return <AppRouter />;
}

export default App;
