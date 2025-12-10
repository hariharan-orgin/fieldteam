import { useState, useMemo, useCallback } from "react";
import { Case } from "@/types/case";

export function useSearch(cases: Case[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return cases;

    const query = searchQuery.toLowerCase();
    return cases.filter(
      (caseData) =>
        caseData.id.toLowerCase().includes(query) ||
        caseData.location.toLowerCase().includes(query)
    );
  }, [cases, searchQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    filteredCases: filteredBySearch,
  };
}
