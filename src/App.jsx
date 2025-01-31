import React from "react";
import {ToastContainer } from "react-toastify";
import Routers from "./Route";
import AnimationThemeProvider from "./_helper/AnimationTheme/AnimationThemeProvider";
import CustomizerProvider from "./_helper/Customizer/CustomizerProvider";

const App = () => (
  <div className="App">
  <ToastContainer
    // stacked
    // position="bottom-right"
    // limit={3}
    // closeOnClick
  />
    <CustomizerProvider>
      <AnimationThemeProvider>
        <Routers />
      </AnimationThemeProvider>
    </CustomizerProvider>
  </div>
);

export default App;
