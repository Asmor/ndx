import Main from "./pages/Main";
import { Route, Routes } from "react-router";
import Editor from "./pages/Editor";

function App() {
  return (
    <Routes>
      <Route index element={<Main />} />
      <Route path="editor">
        <Route index element={<Editor />} />
      </Route>
    </Routes>
  );
}

export default App;
