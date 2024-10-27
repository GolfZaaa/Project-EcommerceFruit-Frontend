import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe(
  "pk_test_51NXzoLKP6BtYWFTXQF5bdWURW7JXVd4YNwaOQkxxh0xScmXG8Y4dhkOMM5GJRDnThjM2XRkVp53bHNufNNLOi9vD00AZ9d4O1n"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
<Elements stripe={stripePromise}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</Elements>

);
