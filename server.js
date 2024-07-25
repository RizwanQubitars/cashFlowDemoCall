require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

// Server setup
app.use(cors());
app.use(express.json());

// Grab the API key and set the port
const apiKey = process.env.BLAND_API_KEY;
const PORT = process.env.PORT || 4000;

app.get('/', async (req, res)=>{
  res.send("hello world");
})
// Handle form submissions
app.post("/request-demo", (req, res) => {
  // Data succesfully received from Frontend

  // Parse the form values
  const { phoneNumber } = req.body;

  // Set the prompt for the AI. Insert the form values directly into the prompt.
  const prompt = `BACKGROUND INFO:
    A lady named Kim, who is a property manager, will make a call to Antonio.

    Call Script:
    1. Greeting:
       - Start with a kind greeting like "Hello" and wait for Antonio's response.
       - After he responds, ask "How are you?" and wait for his response.

    2. Introduction:
       - Introduce yourself: "This is Kim, the property manager for the property located at Street: 1696 Woodhill Avenue, City: Laurel."

    3. Main Message:
       - Explain the purpose of the call: "I'm calling because we haven't received your monthly payment for the property."
       - Mention the urgency: "Today is the last date to make the payment. If the payment is not made, eviction proceedings will begin."

    4. Asking for Reason:
       - Ask: "Is there any particular reason why the payment hasn't been made?"

    5. Emphasizing Importance:
       - Stress the importance of avoiding eviction: "It's really important to avoid eviction, and making the payment today will help with that."

    6. Final Question:
       - Ask: "Are you going to make the payment? I have sent the payment link via message."

    Additional Instructions:
    - Ensure that Kim does not interrupt Antonio and allows him to complete his sentences.
    - The first part of greeting is very important, please follow the mentioned way of greeting.
    - Slow down your speed and take less gap between the communication.
  `;

  // After the phone agent qualifies the lead, they'll transfer to this phone number
  const TRANSFER_PHONE_NUMBER = "+923076191422";

  // Create the parameters for the phone call. Ref: https://docs.bland.ai/api-reference/endpoint/call
  const data = {
    phone_number: phoneNumber,
    task: prompt,
    model: "enhanced",
    voice: "maya",
    max_duration: 2,
    request_data: {
      final_cost: "" },
    reduce_latency: false,
    transfer_phone_number: TRANSFER_PHONE_NUMBER,
  };

  // Dispatch the phone call
  axios
    .post("https://api.bland.ai/v1/calls", data, {
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      const { status } = response.data;

      if (status) {
        res
          .status(200)
          .send({ message: "Phone call dispatched", status: "success" });
      } else {
        res
          .status(400)
          .send({ message: "Error dispatching phone call", status: "error" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);

      res
        .status(400)
        .send({ message: "Error dispatching phone call", status: "error" });
    });
});

// app.get('/getCallsList', (req, res)=>{

//   const data = {};
//   axios
//   .get("https://api.bland.ai/v1/calls", {
//     headers: {
//       authorization: apiKey,
//       "Content-Type": "application/json",
//     },
//   })
//   .then((response) => {
//     const { status } = response.data;

//     if (status) {
//       res
//         .status(200)
//         .send({ message: "Phone call dispatched", status: "success", result: response.data });
//     } else {
//       res
//         .status(400)
//         .send({ message: "Error dispatching phone call", status: "error" });
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);

//     res
//       .status(400)
//       .send({ message: "Error dispatching phone call", status: "error" });
//   });
// });
// app.get('/callDetail', (req, res)=>{
//   const { callID } = req.query;

//   const data = {};
//   axios
//   .get(`https://api.bland.ai/v1/calls/${callID}`, {
//     headers: {
//       authorization: apiKey,
//       "Content-Type": "application/json",
//     },
//   })
//   .then((response) => {
//     const { status } = response.data;

//     if (status) {
//       res
//         .status(200)
//         .send({ message: "Phone call dispatched", status: "success", result: response.data });
//     } else {
//       res
//         .status(400)
//         .send({ message: "Error dispatching phone call", status: "error" });
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);

//     res
//       .status(400)
//       .send({ message: "Error dispatching phone call", status: "error" });
//   });
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
