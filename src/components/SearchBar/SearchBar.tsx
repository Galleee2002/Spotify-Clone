import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Filter, Sparkles, Music, Clock } from "lucide-react";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const suggestions = [
    { text: "Rock classics", icon: Music, color: "#ff6b6b" },
    { text: "Queen - Bohemian Rhapsody", icon: Sparkles, color: "#4ecdc4" },
    { text: "80s music", icon: Clock, color: "#45b7d1" },
    { text: "Progressive rock", icon: Music, color: "#96ceb4" },
    { text: "Heavy metal", icon: Sparkles, color: "#feca57" },
  ];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = useCallback(() => {
    onSearchChange("");
    inputRef.current?.focus();
    setIsTyping(false);
  }, [onSearchChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onSearchChange(value);
      setIsTyping(true);

      // Simular efecto de typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 500);
    },
    [onSearchChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(searchTerm === "");
  }, [searchTerm]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClear();
        inputRef.current?.blur();
      }
    },
    [handleClear]
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      if (onFiltersChange && filters) {
        onFiltersChange({ ...filters, ...newFilters });
      }
    },
    [onFiltersChange, filters]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSearchChange(suggestion);
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [onSearchChange]
  );

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
    setShowSuggestions(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ultra-search-container ${isFocused ? "focused" : ""} ${
        isTyping ? "typing" : ""
      }`}
    >
      {}
      <div className="search-background-glow" />

      <div className="ultra-search-bar">
        <div className="search-input-wrapper">
          {}
          <div className="search-icon-container">
            <Search
              className={`search-icon ${isTyping ? "searching" : ""}`}
              size={20}
            />
            {isTyping && <div className="search-pulse" />}
          </div>

          {}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="ultra-search-input"
            autoComplete="off"
            spellCheck="false"
          />

          {}
          <div className="action-buttons">
            {searchTerm && (
              <button
                onClick={handleClear}
                className="action-btn clear-btn"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}

            {onFiltersChange && (
              <button
                onClick={toggleFilters}
                className={`action-btn filter-btn ${
                  showFilters ? "active" : ""
                }`}
                aria-label="Filtros de búsqueda"
              >
                <Filter size={16} />
                {filters &&
                  Object.values(filters).some(
                    (v) => v !== "all" && v !== true && v !== undefined
                  ) && <div className="filter-indicator" />}
              </button>
            )}
          </div>
        </div>

        {}
        <div
          className={`search-progress ${isFocused || isTyping ? "active" : ""}`}
        />
      </div>

      {}
      {showFilters && filters && onFiltersChange && (
        <div className="ultra-filters-panel">
          <div className="filters-header">
            <Sparkles size={16} />
            <span>Filtros Avanzados</span>
          </div>

          <div className="filter-section">
            <label className="filter-label">Tipo de contenido:</label>
            <div className="filter-pills">
              {[
                { value: "all", label: "Todo", emoji: "🎯" },
                { value: "track", label: "Canciones", emoji: "🎵" },
                { value: "artist", label: "Artistas", emoji: "🎤" },
                { value: "album", label: "Álbumes", emoji: "💿" },
                { value: "playlist", label: "Playlists", emoji: "📋" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    handleFilterChange({ type: type.value as any })
                  }
                  className={`filter-pill ${
                    filters.type === type.value ? "active" : ""
                  }`}
                >
                  <span className="pill-emoji">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-toggle">
              <input
                type="checkbox"
                checked={!filters.explicit}
                onChange={(e) =>
                  handleFilterChange({ explicit: !e.target.checked })
                }
                className="toggle-input"
              />
              <div className="toggle-slider">
                <div className="toggle-thumb" />
              </div>
              <span>Ocultar contenido explícito</span>
            </label>
          </div>

          <div className="filter-section">
            <label className="filter-label">Año de lanzamiento:</label>
            <div className="year-input-container">
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
                className="ultra-year-input"
              />
            </div>
          </div>
        </div>
      )}

      {}
      {showSuggestions && searchTerm === "" && (
        <div className="ultra-suggestions-panel">
          <div className="suggestions-header">
            <Clock size={16} />
            <span>Búsquedas recientes</span>
          </div>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="suggestion-item"
                  style={
                    { "--delay": `${index * 50}ms` } as React.CSSProperties
                  }
                >
                  <div
                    className="suggestion-icon"
                    style={
                      { "--color": suggestion.color } as React.CSSProperties
                    }
                  >
                    <IconComponent size={16} />
                  </div>
                  <span className="suggestion-text">{suggestion.text}</span>
                  <div className="suggestion-arrow">→</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
