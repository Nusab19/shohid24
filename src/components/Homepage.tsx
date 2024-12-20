import { useState, useRef, useEffect, Suspense } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { SearchPerson, SearchResults } from "@/lib/helpers/search";
import List from "./List";
import { Input } from "./ui/input";
import { parseAsString, useQueryState } from "nuqs";
import type { Translation } from "@/lib/translations";
import { DateConverter } from "@/lib/helpers/date";

const Homepage_Sus = ({ translation }: { translation: Translation }) => {
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  );
  const queryRef = useRef<HTMLInputElement | null>(null);

  const [searchResult, setSearchResult] = useState<SearchResults>(
    SearchPerson(""),
  );
  useEffect(() => {
    const res = SearchPerson(query);
    setSearchResult(res);
  }, [query]);
  useHotkeys(
    "mod+k",
    (event) => {
      event.preventDefault();
      // if the input is focused, blur it
      if (document.activeElement === queryRef.current) {
        queryRef.current?.blur();
        return;
      }
      queryRef.current?.focus();
    },
    {
      enableOnFormTags: true,
    },
  );
  useHotkeys(
    "esc",
    () => {
      // blue the currently focused input
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }
    },
    {
      enableOnFormTags: true,
    },
  );

  return (
    <main>
      <div className="m-3 flex flex-col items-center justify-between gap-2 border-b py-2 text-start md:flex-row">
        <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
          {translation.header}
        </h1>
        <Input
          ref={queryRef}
          className={`w-full md:max-w-72 ${translation.lang == "en" && "tracking-tighter"}`}
          placeholder={translation.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <p
        className={`-mt-1 mb-2 tracking-wide transition-all duration-100 md:text-lg ${query.length === 0 ? "scale-0" : ""}`}
      >
        {translation.lang === "en" ? (
          <>
            Found{" "}
            <span className="inline-block w-8 font-bold text-red-700 dark:text-red-500">
              {searchResult.length}
            </span>{" "}
            matching person
          </>
        ) : (
          <>
            <span className="inline-block w-8 font-bold text-red-700 dark:text-red-500">
              {DateConverter.toBengali(searchResult.length)}
            </span>{" "}
            জন এর রেজাল্ট দেখানো হচ্ছে
          </>
        )}
      </p>
      <p
        className={`-mt-8 mb-2.5 font-bold tracking-wide transition-all duration-100 md:text-lg ${query.length === 0 ? "" : "scale-0"}`}
      >
        {translation.lang == "en" ? (
          <>
            Out list currently has{" "}
            <span className="inline-block w-8 font-bold text-red-700 dark:text-red-500">
              {translation.martyrCount}
            </span>{" "}
            martyrs
          </>
        ) : (
          <>
            আমাদের তালিকায় বর্তমানে{" "}
            <span className="inline-block w-8 font-bold text-red-700 dark:text-red-500">
              {translation.martyrCount}
            </span>{" "}
            জন শহীদ রয়েছেন
          </>
        )}
      </p>
      <List searchResult={searchResult} lang={translation.lang} query={query} />
    </main>
  );
};

const Homepage = ({ translation }: { translation: Translation }) => {
  return (
    <Suspense
      fallback={
        <main>
          <div className="m-3 flex flex-col items-center justify-between gap-2 border-b py-2 text-start md:flex-row">
            <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
              {translation.header}
            </h1>
            <Input
              className="w-full md:max-w-64"
              placeholder={translation.searchPlaceholder}
            />
          </div>

          <List searchResult={[]} lang={translation.lang} />
        </main>
      }
    >
      <Homepage_Sus translation={translation} />
    </Suspense>
  );
};

export default Homepage;
