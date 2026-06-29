import { render, screen } from "@testing-library/react";
import React from "react";
import SearchSuggestions, { HistoryItem } from "../components/SearchSuggestions";

describe("SearchSuggestions", () => {
    const defaultProps = {
        suggestions: ["Crocin", "Dolo 650"],
        activeIndex: -1,
        onSelect: jest.fn(),
        visible: true,
        isLoading: false,
        error: null,
        noResults: false,
    };

    it("renders suggestions correctly when visible", () => {
        render(<SearchSuggestions {...defaultProps} />);
        expect(screen.getByText("Crocin")).toBeInTheDocument();
        expect(screen.getByText("Dolo 650")).toBeInTheDocument();
    });

    it("renders nothing when not visible", () => {
        const { container } = render(
            <SearchSuggestions {...defaultProps} visible={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renders loading state correctly", () => {
        render(<SearchSuggestions {...defaultProps} isLoading={true} />);
        expect(screen.getByText("Searching medicines...")).toBeInTheDocument();
    });

    it("renders error state correctly", () => {
        render(
            <SearchSuggestions {...defaultProps} error="Failed to fetch data" />
        );
        expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
    });

    it("renders no results message correctly", () => {
        render(
            <SearchSuggestions {...defaultProps} noResults={true} />
        );
        expect(screen.getByText(/No medicines found/)).toBeInTheDocument();
    });

    it("renders history items when in history mode", () => {
        const historyItems: HistoryItem[] = [
            { query: "Calpol", pinned: true, timestamp: Date.now() },
            { query: "Aspirin", pinned: false, timestamp: Date.now() - 1000 },
        ];

        render(
            <SearchSuggestions
                {...defaultProps}
                isHistory={true}
                historyItems={historyItems}
                suggestions={[]}
            />
        );

        expect(screen.getByText("Recent Searches")).toBeInTheDocument();
        expect(screen.getByText("Clear All")).toBeInTheDocument();
        expect(screen.getByText("Calpol")).toBeInTheDocument();
        expect(screen.getByText("Aspirin")).toBeInTheDocument();
    });
});
