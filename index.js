require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// Allow all origins permanently
app.use(cors()); // This will allow requests from any origin

const stripe = require("stripe")(process.env.STRIPEKEY);
const YOUR_DOMAIN = "http://oni-nu.vercel.app";

app.post("/checkout", async (req, res) => {
  try {
    const lineItems = req.body.map((item) => ({
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${YOUR_DOMAIN}/valid`,
      cancel_url: `${YOUR_DOMAIN}/cart`,
      automatic_tax: { enabled: true },
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Failed to create checkout session");
  }
});

app.get("*", (req, res) => {
  res.redirect("http://oni-nu.vercel.app");
});

app.listen(3000, () => console.log("Running on port 3000"));
