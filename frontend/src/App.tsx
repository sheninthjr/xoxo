import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLogin from "./components/UserLogin";
import GameBoard from "./components/GameBoard";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/user" element={<UserLogin />}></Route>
            <Route path="/game/:gameId" element={<GameBoard />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}
