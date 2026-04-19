import ComboBox from "@/components/Shared/Inputs/ComboBox/ComboBox";
import SearchInput from "@/components/Shared/Inputs/SearchInput/SearchInput";
import CustomSelectMenu from "@/components/Shared/SelectMenus/CustomSelectMenu/CustomSelectMenu";
import { TOTAL_MAPS_PLACEHOLDER } from "@/data/constants";
import s from "./SortSection.module.scss";
import SortView from "./SortView/SortView";

const SortSection = ({
  setPaginationNumber,
  allMaps,
  mapsData,
  mapsScroll,
}) => {
  const totalMaps = mapsData?.length || TOTAL_MAPS_PLACEHOLDER;
  const displayedMaps = mapsScroll?.length || 0;

  return (
    <section className={s.sortSection}>
      <div className={s.leftSide}>
        <CustomSelectMenu id="sort-by" />

        <SearchInput
          placeholder="Search maps by name..."
          queryName="name"
          autoFocus={true}
        />
        <ComboBox
          placeholder="Maps by author name..."
          id="author"
          queryName="author"
          options={getMapsAuthors(allMaps)}
          orderByCount
        />

        <p className={s.totalMapsText}>
          Showing <span>{displayedMaps}</span> of <span>{totalMaps}</span> maps
        </p>
      </div>

      <SortView setPaginationNumber={setPaginationNumber} />
    </section>
  );
};

export default SortSection;

function getMapsAuthors(maps = []) {
  const seen = new Map();

  maps.forEach(({ Author }) => {
    if (!Author) {
      return;
    }

    const authors = extractAuthorNames(Author);
    if (authors.length === 0) {
      return;
    }

    const mapAuthorKeys = new Set();

    authors.forEach((authorName) => {
      const normalizedKey = normalizeAuthor(authorName);
      if (!normalizedKey || mapAuthorKeys.has(normalizedKey)) {
        return;
      }

      mapAuthorKeys.add(normalizedKey);
      const existingAuthor = seen.get(normalizedKey);
      const isNew = !existingAuthor;
      const isShorterLabel =
        authorName.length < (existingAuthor?.label?.length ?? Infinity);

      if (isNew) {
        seen.set(normalizedKey, {
          id: normalizedKey,
          label: authorName,
          value: authorName,
          count: 1,
        });
        return;
      }

      if (isShorterLabel) {
        existingAuthor.label = authorName;
        existingAuthor.value = authorName;
      }

      existingAuthor.count += 1;
    });
  });

  return Array.from(seen.values());
}

function extractAuthorNames(authorText = "") {
  const text = String(authorText).trim();
  if (!text) {
    return [];
  }

  const hasByKeyword = text.toLowerCase().includes("by");
  let byKeyWordMatches = [];

  if (hasByKeyword) {
    const matches = text.matchAll(/\bby\b\s*:?\s*([^()]+)/gi);
    byKeyWordMatches = Array.from(matches, (match) => match[1]?.trim());
  }

  const sourceChunks =
    byKeyWordMatches.length > 0 ? [text, ...byKeyWordMatches] : [text];
  const authors = sourceChunks.flatMap(splitAuthorChunk).filter(isLikelyAuthor);

  return Array.from(new Set(authors));
}

function splitAuthorChunk(chunk = "") {
  return chunk
    .replace(/\([^)]*\)|\[[^\]]*\]/g, " ")
    .split(/\s*(?:,|&|\/|\+|\band\b|\bfeat\.?\b|\bft\.?\b)\s*/i)
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeAuthor(author) {
  return author
    .toLowerCase()
    .trim()
    .replace(/[?!.,#'"]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s/g, "");
}

function isLikelyAuthor(author) {
  const hasAnd = /&|\band\b/i.test(author);
  if (hasAnd) {
    return false;
  }

  let score = 0;

  const has15Char = author.length >= 15;
  const has3Words = author.split(/\s+/).length >= 3;
  const hasNumber = /\d/.test(author);
  const hasParenthesis = /[()]/.test(author);
  const hasKeywords = /\b(by|version|reworked|ported|finished)\b/i.test(author);

  if (has15Char) {
    score += 1;
  }
  if (has3Words) {
    score += 2;
  }
  if (hasNumber) {
    score += 1;
  }
  if (hasParenthesis) {
    score += 2;
  }
  if (hasKeywords) {
    score += 2;
  }

  return score < 3;
}
