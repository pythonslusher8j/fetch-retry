import { fetchWithRetry } from "./index.js";

const response = await fetchWithRetry("https://api.github.com/zen", {}, { retries: 2 });
console.log(await response.text());
