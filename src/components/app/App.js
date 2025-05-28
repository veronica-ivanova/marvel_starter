import { BrowserRouter, Route, Routes } from "react-router";
import AppHeader from "../appHeader/AppHeader";
import { ComicsPage, MainPage } from "../pages";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<MainPage/>} />
            <Route path="/comics" element={<ComicsPage/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
