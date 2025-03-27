require("dotenv").config();
const puppeteer = require("puppeteer");
const Product = require("./models/product");

async function fetchPrice(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  // Rotate User-Agent to avoid detection
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
  ];
  await page.setUserAgent(
    userAgents[Math.floor(Math.random() * userAgents.length)]
  );

  // Spoof browser fingerprint to bypass bot detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  // Set additional headers
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.amazon.in/",
  });

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Add a random delay (1-4 seconds) to mimic human behavior
    await new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * 3000) + 1000)
    );

    const price = await page.evaluate(() => {
      const priceElement = document.querySelector(".a-price-whole");
      return priceElement ? priceElement.innerText.trim() : null;
    });

    return price;
  } catch (error) {
    console.error("❌ Error fetching price:", error);
  } finally {
    await browser.close();
  }
}

async function updatePrices() {
  try {
    const products = await Product.find();

    for (const product of products) {
      var newPrice = await fetchPrice(product.affiliateLink);
      newPrice = parseFloat(newPrice.replace(/,/g, ""));
      if (newPrice && newPrice !== product.price) {
        // Only update if price has changed

        product.price = newPrice;
        product.lastUpdated = new Date();
        await product.save();
        console.log(`✅ Updated price for ${product.name}: ₹${newPrice}`);
      } else {
        console.log(
          `🔍 No change in price for ${product.name}, skipping update.`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error updating prices:", error);
  }
}

module.exports = updatePrices;
