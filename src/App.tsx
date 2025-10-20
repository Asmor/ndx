import Main from "./pages/Main";
import { Route, Routes } from "react-router";
import TextEditor from "./pages/TextEditor";

function App() {
  return (
    <Routes>
      <Route index element={<Main />} />
      <Route path="editor">
        <Route index element={<TextEditor />} />
      </Route>
    </Routes>
  );
}

export default App;
