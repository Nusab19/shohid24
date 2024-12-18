import createFuzzySearch, { FuzzyResult } from "@nozbe/microfuzz";
import searchableData from "./../../../public/searchableData.json"; // Preloaded data

const fuzzySearch = createFuzzySearch(searchableData, {
  getText: (item) => [
    item.name.bn,
    item.name.en,
    item.profession.bn,
    item.profession.en,
    item.info.bn,
    item.info.en,
    item.date,
  ],
});

export function SearchPerson(query: string) {
  const result = fuzzySearch(query);
  // console.log(result);
  return result.slice(0, 50);
}

export const totalMartyrs = searchableData.length;

export type SearchResults = FuzzyResult<{
  id: number;
  name: {
    bn: string;
    en: string;
  };
  profession: {
    bn: string;
    en: string;
  };
  info: {
    bn: string;
    en: string;
  };
  date: string;
  hasImage: number;
}>[];
