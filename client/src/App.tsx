import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CollectionProvider } from "./contexts/CollectionContext";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import AddWatch from "./pages/AddWatch";
import EditWatch from "./pages/EditWatch";
import Wishlist from "./pages/Wishlist";
import WatchDetail from "./pages/WatchDetail";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/wishlist"} component={Wishlist} />
      <Route path={"/add"} component={AddWatch} />
      <Route path={"/edit/:id"} component={EditWatch} />
      <Route path={"/watch/:id"} component={WatchDetail} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CollectionProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CollectionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
