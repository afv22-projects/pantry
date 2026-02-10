import { StoreProvider, useStore } from "./state.jsx";

function AppContent() {
  const { state } = useStore();

  if (!state.loaded) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <p className="text-muted font-mono">loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-4">
      <h1 className="text-2xl font-mono text-accent">pantry</h1>
      <p className="mt-2 text-muted">app scaffold ready</p>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
