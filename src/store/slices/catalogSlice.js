import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  activeFilters: {
    category: [],
    difficulty: [],
    duration: [],
    status: [],
  },
  sortBy: 'relevant',
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    toggleFilter: (state, action) => {
      const { group, value } = action.payload;
      const current = state.activeFilters[group];
      state.activeFilters[group] = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
    },
    removeFilter: (state, action) => {
      const { group, value } = action.payload;
      state.activeFilters[group] = state.activeFilters[group].filter((v) => v !== value);
    },
    clearAllFilters: (state) => {
      state.activeFilters = { category: [], difficulty: [], duration: [], status: [] };
      state.search = '';
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setSearch, toggleFilter, removeFilter, clearAllFilters, setSortBy } = catalogSlice.actions;
export default catalogSlice.reducer;
