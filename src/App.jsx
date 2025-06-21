import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import { CartProvider } from "./Context/CartContext";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./Routes/AppRoutes";
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="bottom-right" />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
