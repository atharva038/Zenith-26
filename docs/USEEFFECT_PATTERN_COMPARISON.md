# useEffect & useCallback Pattern - Correct vs Incorrect

## ❌ WRONG Pattern (Causes Constant Reloading)

```jsx
const fetchData = useCallback(async () => {
  // ... API call
}, [filters]);

useEffect(() => {
  fetchData();
}, [filters]); // ❌ WRONG: Depends directly on filters
```

**Why it fails:**
1. User types → `filters` changes
2. `fetchData` function recreates (because of `useCallback([filters])`)
3. `useEffect` ALSO runs (because of `useEffect([filters])`)
4. **Result: TWO executions, constant reloading**

---

## ✅ CORRECT Pattern (Used in AdminWomenTournament)

```jsx
const fetchData = useCallback(async () => {
  // ... API call
}, [filters]);

useEffect(() => {
  fetchData();
}, [fetchData]); // ✅ CORRECT: Depends on memoized function
```

**Why it works:**
1. User types → `filters` changes
2. `fetchData` function recreates (because of `useCallback([filters])`)
3. `useEffect` sees function reference changed → runs ONCE
4. **Result: SINGLE execution, smooth typing**

---

## Visual Flow Comparison

### ❌ Wrong Pattern Flow:
```
User types "M"
    ↓
filters: {search: "M"}
    ↓
    ├─→ useCallback recreates fetchData (because filters changed)
    └─→ useEffect ALSO runs (because filters changed)
        ↓
    TWO API calls → Constant reloading
```

### ✅ Correct Pattern Flow:
```
User types "M"
    ↓
filters: {search: "M"}
    ↓
useCallback recreates fetchData (because filters changed)
    ↓
useEffect sees fetchData reference changed → runs ONCE
    ↓
ONE API call → Smooth typing
```

---

## Real World Example

### AdminMarathon (BEFORE - Wrong):
```jsx
// State
const [filters, setFilters] = useState({
  search: "",
  status: "",
  page: 1,
});

// ❌ Function memoized with filters
const fetchRegistrations = useCallback(async () => {
  const response = await api.get('/marathon/registrations', {
    params: filters
  });
  setRegistrations(response.data);
}, [filters]);

// ❌ Effect depends directly on filters - DOUBLE EXECUTION
useEffect(() => {
  fetchRegistrations();
}, [filters]);
```

**Result:** Type one character → page reloads constantly ❌

---

### AdminMarathon (AFTER - Correct):
```jsx
// State
const [filters, setFilters] = useState({
  search: "",
  status: "",
  page: 1,
});

// ✅ Function memoized with filters
const fetchRegistrations = useCallback(async () => {
  const response = await api.get('/marathon/registrations', {
    params: filters
  });
  setRegistrations(response.data);
}, [filters]);

// ✅ Effect depends on memoized function - SINGLE EXECUTION
useEffect(() => {
  fetchRegistrations();
}, [fetchRegistrations]);
```

**Result:** Type smoothly, no constant reloading ✅

---

## Key React Principles

### 1. useCallback Purpose
```jsx
const memoizedFn = useCallback(() => {
  // function body
}, [dependencies]);
```
- **Creates a memoized version** of the function
- Function reference **only changes** when dependencies change
- Prevents unnecessary re-creation of functions

### 2. useEffect with Function Dependencies
```jsx
useEffect(() => {
  memoizedFn();
}, [memoizedFn]);
```
- Watches the **function reference**, not its dependencies
- Only runs when the **memoized function changes**
- React's recommended pattern for async data fetching

### 3. Why Not Both Dependencies?
```jsx
// ❌ DON'T DO THIS:
const fn = useCallback(() => {...}, [dep1]);
useEffect(() => { fn(); }, [dep1]); // Wrong!

// ✅ DO THIS INSTEAD:
const fn = useCallback(() => {...}, [dep1]);
useEffect(() => { fn(); }, [fn]); // Correct!
```

---

## Common Mistakes

### Mistake 1: Duplicate Dependencies
```jsx
// ❌ BAD
const fetch = useCallback(async () => {...}, [filters]);
useEffect(() => { fetch(); }, [filters]); // Causes double execution
```

### Mistake 2: No Memoization
```jsx
// ❌ BAD
const fetch = async () => {...}; // No useCallback
useEffect(() => { fetch(); }, [fetch]); // fetch recreates every render
```

### Mistake 3: Wrong Dependencies
```jsx
// ❌ BAD
const fetch = useCallback(async () => {
  // Uses filters inside but not in deps
  api.get(`?status=${filters.status}`);
}, []); // Empty deps = stale closure
```

---

## ESLint Rule Explanation

When you see this warning:
```
React Hook useEffect has a missing dependency: 'fetchRegistrations'
```

**What it means:**
- You're calling `fetchRegistrations` inside `useEffect`
- But it's not in the dependency array
- This can lead to stale closures and bugs

**Correct fix:**
```jsx
useEffect(() => {
  fetchRegistrations();
}, [fetchRegistrations]); // ✅ Add it to dependencies
```

**Why fetchRegistrations is safe as a dependency:**
- It's wrapped in `useCallback` with its own dependencies
- The function reference only changes when those dependencies change
- This is the **intended React pattern**

---

## Reference: Other Patterns

### Pattern 1: Direct Fetch (No Memoization Needed)
```jsx
useEffect(() => {
  const fetchData = async () => {
    const response = await api.get('/data');
    setData(response.data);
  };
  fetchData();
}, [filters]); // ✅ OK: Function defined inside effect
```

### Pattern 2: Separate Concerns
```jsx
// Data fetching function (stable reference)
const fetchData = useCallback(async () => {
  return await api.get('/data');
}, []);

// Effect for different triggers
useEffect(() => {
  fetchData().then(setData);
}, [filters, fetchData]); // ✅ OK: filters triggers, fetchData is stable
```

---

## Summary Checklist

When creating async data fetching with filters:

- [ ] ✅ Use `useCallback` with filter dependencies for your fetch function
- [ ] ✅ Use `useEffect` with the memoized function as dependency
- [ ] ❌ DON'T use both `useCallback([filters])` and `useEffect([filters])`
- [ ] ✅ Follow the AdminWomenTournament pattern
- [ ] ✅ Let ESLint guide you - don't disable warnings
- [ ] ✅ Test by typing in filter inputs - should be smooth, not constant reloading

---

## Files Reference

**Correct Implementation:**
- `frontend/src/pages/admin/AdminWomenTournament.jsx` (lines 108-144)
- `frontend/src/pages/admin/AdminMarathon.jsx` (lines 62-90) - AFTER FIX

**Pattern:**
```jsx
const fetchFn = useCallback(async () => {...}, [filters]);
useEffect(() => { fetchFn(); }, [fetchFn]);
```

This is the **React best practice** for data fetching with dependencies! 🎯
