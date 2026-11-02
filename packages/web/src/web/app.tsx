import { Route, Switch } from "wouter";
import Landing from "./pages/index";
import Dashboard from "./pages/app";
import SignIn from "./pages/entrar";
import { Provider } from "./components/provider";
import { AuthGate, RequireAuth } from "./components/auth-gate";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <AuthGate>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/entrar" component={SignIn} />
          <Route path="/app">
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          </Route>
          <Route>
            <div className="grid min-h-screen place-items-center font-display text-3xl text-teal-900">
              Página não encontrada
            </div>
          </Route>
        </Switch>
      </AuthGate>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
