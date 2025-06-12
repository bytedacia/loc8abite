import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const PLACE_TYPES: Record<string, string> = {
  restaurant: "Q11707",
  "tourist attraction": "Q570116",
  landmark: "Q2221906",
};

export const fetchWikidataPlaces = async () => {
  const allPlaces: any[] = [];

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  for (const [label, wikidataID] of Object.entries(PLACE_TYPES)) {
    await delay(1000);
    const endpoint = "https://query.wikidata.org/sparql";
    const query = `
      SELECT ?placeLabel ?image ?location WHERE {
        ?place wdt:P31 wd:${wikidataID};
               wdt:P18 ?image;
               wdt:P625 ?location.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      LIMIT 50
    `;

    const url = `${endpoint}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/sparql-results+json" },
    });

    const data = (await res.json()) as {
      results: {
        bindings: {
          placeLabel: { value: string };
          image: { value: string };
          location: { value: string };
        }[];
      };
    };

    const places = data.results.bindings.map((item: any) => {
      const coords = item.location.value
        .replace("Point(", "")
        .replace(")", "")
        .split(" ");
      return {
        name: item.placeLabel.value,
        image: item.image.value,
        lat: parseFloat(coords[1]),
        lng: parseFloat(coords[0]),
        type: label,
      };
    });

    allPlaces.push(...places);
    console.log(`✅ Fetched ${places.length} from ${label}`);
  }

  const filePath = path.join(__dirname, "../../data/wikidata-places.json");
  fs.writeFileSync(filePath, JSON.stringify(allPlaces, null, 2));
  console.log("✅ All places saved to wikidata-places.json");
};
