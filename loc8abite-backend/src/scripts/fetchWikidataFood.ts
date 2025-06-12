import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export const fetchWikidataFood = async () => {
  const endpoint = "https://query.wikidata.org/sparql";

  const query = `
    SELECT ?foodLabel ?image ?countryLabel WHERE {
      ?food wdt:P31/wdt:P279* wd:Q2095;    # instance/subclass of food
            wdt:P18 ?image;                # has image
            wdt:P495 ?country.             # has country of origin
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 200
  `;

  const url = `${endpoint}?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/sparql-results+json" },
    });

    const data = (await res.json()) as {
      results: {
        bindings: {
          foodLabel: { value: string };
          image: { value: string };
          countryLabel: { value: string };
        }[];
      };
    };

    const foods = data.results.bindings.map((item: any) => ({
      name: item.foodLabel.value,
      image: item.image.value,
      country: item.countryLabel.value,
      type: "food",
    }));

    const filePath = path.join(__dirname, "../../data/wikidata-food.json");
    fs.writeFileSync(filePath, JSON.stringify(foods, null, 2));
    console.log(`✅ Saved ${foods.length} foods to wikidata-food.json`);
  } catch (error) {
    console.error("❌ Error fetching food data:", error);
  }
};
