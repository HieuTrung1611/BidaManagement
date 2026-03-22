# Hydration Error Prevention Guide

## Common Causes and Solutions

### 1. localStorage/sessionStorage Usage

❌ **Wrong:** Accessing storage during initial render

```tsx
// This causes hydration mismatch
const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
```

✅ **Correct:** Use effect to access storage after mount

```tsx
const [theme, setTheme] = useState("light"); // Server-safe default
const isMounted = useIsMounted();

useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
}, []);
```

### 2. Window Object Usage

❌ **Wrong:** Using window directly in render or state initialization

```tsx
// This breaks during SSR
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
```

✅ **Correct:** Check if window exists and use effects

```tsx
const [isMobile, setIsMobile] = useState(false); // Safe default
const isMounted = useIsMounted();

useEffect(() => {
    if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
    }
}, []);
```

### 3. Date/Time Values

❌ **Wrong:** Using dynamic dates that change between server and client

```tsx
// This will be different on server vs client
const [currentTime] = useState(new Date().toLocaleString());
```

✅ **Correct:** Use effect for dynamic values

```tsx
const [currentTime, setCurrentTime] = useState("");
const isMounted = useIsMounted();

useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
}, []);

// Only show after hydration
if (!isMounted) return <div>Loading...</div>;
```

### 4. Random Values

❌ **Wrong:** Math.random() during render

```tsx
const [randomId] = useState(Math.random().toString());
```

✅ **Correct:** Generate random values after mount

```tsx
const [randomId, setRandomId] = useState("");
const isMounted = useIsMounted();

useEffect(() => {
    setRandomId(Math.random().toString());
}, []);
```

## Best Practices

1. **Use the `useIsMounted` hook** for components that need to wait for client hydration
2. **Always check `typeof window !== 'undefined'`** before accessing window
3. **Provide server-safe defaults** for all state that depends on browser APIs
4. **Use `suppressHydrationWarning`** only when absolutely necessary and you understand the implications
5. **Consider using dynamic imports** with `{ ssr: false }` for truly client-only components

## Debugging Tips

1. Check browser console for hydration warnings
2. Look for differences between server HTML and client render
3. Use React DevTools to inspect component trees
4. Add `suppressHydrationWarning` temporarily to isolate issues
