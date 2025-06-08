import React, { useState, useRef, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { SearchBarProps, SearchFilters } from "../../types";
import "./SearchBar.css";

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar canciones, artistas o álbumes...",
  autoFocus = false,
  filters,
  onFiltersChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    if (onFiltersChange && filters) {
      onFiltersChange({ ...filters, ...newFilters });
    }
  };

  return (
    <div className={`search-bar ${isFocused ? "focused" : ""}`}>
      <div className="search-input-container">
        <Search className="search-icon" size={20} />

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="clear-button"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}

        {onFiltersChange && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-button ${showFilters ? "active" : ""}`}
            aria-label="Filtros de búsqueda"
          >
            <Filter size={16} />
          </button>
        )}
      </div>

      {showFilters && filters && onFiltersChange && (
        <div className="search-filters">
          <div className="filter-group">
            <label>Tipo:</label>
            <div className="filter-options">
              {["all", "track", "artist", "album", "playlist"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange({ type: type as any })}
                  className={`filter-option ${
                    filters.type === type ? "active" : ""
                  }`}
                >
                  {type === "all"
                    ? "Todo"
                    : type === "track"
                    ? "Canciones"
                    : type === "artist"
                    ? "Artistas"
                    : type === "album"
                    ? "Álbumes"
                    : "Playlists"}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={!filters.explicit}
                onChange={(e) =>
                  handleFilterChange({ explicit: !e.target.checked })
                }
              />
              Ocultar contenido explícito
            </label>
          </div>

          <div className="filter-group">
            <label>Año:</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={filters.year || ""}
              onChange={(e) =>
                handleFilterChange({
                  year: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="Cualquier año"
              className="year-input"
            />
          </div>
        </div>
      )}

      {/* Sugerencias de búsqueda reciente */}
      {isFocused && searchTerm === "" && (
        <div className="search-suggestions">
          <div className="suggestions-header">Búsquedas recientes</div>
          <div className="suggestion-item">Rock classics</div>
          <div className="suggestion-item">Queen</div>
          <div className="suggestion-item">80s music</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
