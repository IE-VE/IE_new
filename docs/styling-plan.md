# 🎨 Style & Layout Guide

## 1. Overview

This guide covers the foundational aspects of our design system, including color palettes, typography, spacing, layout, and component styling (especially buttons). It is built around Tailwind CSS v4, leveraging OKLCH for a modern color approach. By combining these guidelines, we ensure a consistent, responsive, and accessible interface across our web application.

---

## 2. Color System

### 2.1 Why OKLCH?

We’re using the OKLCH color space for richer and more accurate color representation on devices that support it. Tailwind CSS v4 makes it easier to work with advanced color spaces, allowing us to define custom variables and utilize them across light and dark themes.

### 2.2 Palette & Scales

Below are our primary (teal) and neutral color scales for both light and dark themes. Use these for backgrounds, text, accents, and UI elements as appropriate.

#### Primary Colors (Teal)

| Name        | Light Theme (OKLCH)  | Dark Theme (OKLCH)   | Description                     |
| ----------- | -------------------- | -------------------- | ------------------------------- |
| primary-50  | oklch(0.97 0.03 180) | oklch(0.15 0.05 180) | Very light teal, backgrounds    |
| primary-100 | oklch(0.93 0.05 180) | oklch(0.20 0.07 180) | Light teal, subtle backgrounds  |
| primary-200 | oklch(0.88 0.07 180) | oklch(0.25 0.09 180) | Soft teal, hover states         |
| primary-300 | oklch(0.80 0.10 180) | oklch(0.30 0.11 180) | Medium-light teal, borders      |
| primary-400 | oklch(0.73 0.13 180) | oklch(0.37 0.13 180) | Medium teal, secondary elements |
| primary-500 | oklch(0.65 0.16 180) | oklch(0.45 0.16 180) | Base teal, primary elements     |
| primary-600 | oklch(0.58 0.14 180) | oklch(0.53 0.14 180) | Medium-dark teal, hover states  |
| primary-700 | oklch(0.50 0.12 180) | oklch(0.60 0.12 180) | Dark teal, active states        |
| primary-800 | oklch(0.40 0.09 180) | oklch(0.68 0.09 180) | Very dark teal, text on light   |
| primary-900 | oklch(0.25 0.06 180) | oklch(0.75 0.06 180) | Deepest teal, emphasized text   |

#### Neutral Colors

| Name        | Light Theme (OKLCH)  | Dark Theme (OKLCH)   | Description                   |
| ----------- | -------------------- | -------------------- | ----------------------------- |
| neutral-50  | oklch(0.98 0.01 180) | oklch(0.10 0.01 180) | Nearly white/black            |
| neutral-100 | oklch(0.93 0.02 180) | oklch(0.15 0.02 180) | Off-white/Very dark gray      |
| neutral-200 | oklch(0.86 0.02 180) | oklch(0.23 0.02 180) | Light gray/Dark gray          |
| neutral-300 | oklch(0.78 0.02 180) | oklch(0.33 0.02 180) | Light-medium gray/Medium-dark |
| neutral-400 | oklch(0.68 0.02 180) | oklch(0.43 0.02 180) | Medium gray                   |
| neutral-500 | oklch(0.58 0.02 180) | oklch(0.53 0.02 180) | Medium-dark gray/Medium-light |
| neutral-600 | oklch(0.48 0.02 180) | oklch(0.63 0.02 180) | Dark gray/Light gray          |
| neutral-700 | oklch(0.38 0.02 180) | oklch(0.73 0.02 180) | Very dark gray/Off-white      |
| neutral-800 | oklch(0.26 0.01 180) | oklch(0.83 0.01 180) | Nearly black/white            |
| neutral-900 | oklch(0.16 0.01 180) | oklch(0.93 0.01 180) | Black/White                   |

---

## 3. Typography

### 3.1 Fonts

- **Primary Font**: `Inter`, `Roboto`, or system-ui (depending on availability).
- **Fallback Fonts**: `Arial`, `sans-serif`.

### 3.2 Font Sizes & Weights

We'll define a simple type scale for both headings and body text in Tailwind:

| Token | Size            | Tailwind Class | Example Usage         |
| ----- | --------------- | -------------- | --------------------- |
| xs    | 0.75rem (12px)  | `text-xs`      | Small disclaimers     |
| sm    | 0.875rem (14px) | `text-sm`      | Helper text, captions |
| base  | 1rem (16px)     | `text-base`    | Normal body text      |
| lg    | 1.125rem (18px) | `text-lg`      | Subheadings           |
| xl    | 1.25rem (20px)  | `text-xl`      | Section headings      |
| 2xl   | 1.5rem (24px)   | `text-2xl`     | Page headings         |
| 3xl   | 1.875rem (30px) | `text-3xl`     | Large headings        |

**Font Weights**

- **Regular** (400) for paragraph text, default body.
- **Medium** (500-600) for subheadings or emphasis.
- **Bold** (700) for headings.

### 3.3 Line Height & Letter Spacing

- **Line Height**: `1.5` (150%) for most paragraphs.
- **Letter Spacing**: Normal (`tracking-normal`) for body text; slightly wider (`tracking-wide`) for uppercase or small-label text.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Tailwind’s default spacing is typically 0.25rem increments. We can keep it simple:

| Token | px   | Tailwind Class | Common Usage      |
| ----- | ---- | -------------- | ----------------- |
| 1     | 4px  | `p-1`, `m-1`   | Extra small space |
| 2     | 8px  | `p-2`, `m-2`   | Small space       |
| 4     | 16px | `p-4`, `m-4`   | Default space     |
| 6     | 24px | `p-6`, `m-6`   | Larger space      |
| 8     | 32px | `p-8`, `m-8`   | Section spacing   |
| 10    | 40px | `p-10`, `m-10` | Major layout gap  |

### 4.2 Breakpoints

We’ll rely on Tailwind's defaults:

- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1280px`
- **2xl**: `1536px`

You can override or add custom breakpoints in `tailwind.config.js` if needed.

### 4.3 Border Radius & Shadows

- **Border Radius**: Use `.rounded-md` (4px) by default, `.rounded-lg` (8px) for cards, and `.rounded-full` for circular elements (like an avatar).
- **Shadows**:
  - **Light theme**: prefer `shadow-sm` or `shadow-md` for subtle elevations.
  - **Dark theme**: use lower opacity shadows or rely on outlines to highlight elements.

---

## 5. Theme Implementation with Tailwind v4

Below is the updated code snippet for color variables in both light and dark themes. We’ll also add references to typical usage in our utility classes.

```css
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));

@theme {
	/* Primary teal colors - Light theme */
	--color-primary-50: oklch(0.97 0.03 180);
	--color-primary-100: oklch(0.93 0.05 180);
	--color-primary-200: oklch(0.88 0.07 180);
	--color-primary-300: oklch(0.8 0.1 180);
	--color-primary-400: oklch(0.73 0.13 180);
	--color-primary-500: oklch(0.65 0.16 180);
	--color-primary-600: oklch(0.58 0.14 180);
	--color-primary-700: oklch(0.5 0.12 180);
	--color-primary-800: oklch(0.4 0.09 180);
	--color-primary-900: oklch(0.25 0.06 180);

	/* Neutral colors - Light theme */
	--color-neutral-50: oklch(0.98 0.01 180);
	--color-neutral-100: oklch(0.93 0.02 180);
	--color-neutral-200: oklch(0.86 0.02 180);
	--color-neutral-300: oklch(0.78 0.02 180);
	--color-neutral-400: oklch(0.68 0.02 180);
	--color-neutral-500: oklch(0.58 0.02 180);
	--color-neutral-600: oklch(0.48 0.02 180);
	--color-neutral-700: oklch(0.38 0.02 180);
	--color-neutral-800: oklch(0.26 0.01 180);
	--color-neutral-900: oklch(0.16 0.01 180);

	/* Dark theme overrides */
	@dark {
		--color-primary-50: oklch(0.15 0.05 180);
		--color-primary-100: oklch(0.2 0.07 180);
		--color-primary-200: oklch(0.25 0.09 180);
		--color-primary-300: oklch(0.3 0.11 180);
		--color-primary-400: oklch(0.37 0.13 180);
		--color-primary-500: oklch(0.45 0.16 180);
		--color-primary-600: oklch(0.53 0.14 180);
		--color-primary-700: oklch(0.6 0.12 180);
		--color-primary-800: oklch(0.68 0.09 180);
		--color-primary-900: oklch(0.75 0.06 180);

		--color-neutral-50: oklch(0.1 0.01 180);
		--color-neutral-100: oklch(0.15 0.02 180);
		--color-neutral-200: oklch(0.23 0.02 180);
		--color-neutral-300: oklch(0.33 0.02 180);
		--color-neutral-400: oklch(0.43 0.02 180);
		--color-neutral-500: oklch(0.53 0.02 180);
		--color-neutral-600: oklch(0.63 0.02 180);
		--color-neutral-700: oklch(0.73 0.02 180);
		--color-neutral-800: oklch(0.83 0.01 180);
		--color-neutral-900: oklch(0.93 0.01 180);
	}
}
```

### 5.1 Semantic Color Variables

We’ll define semantic aliases that map to our color scale. This ensures consistent usage across components without manually referencing numeric color tokens every time.

```css
@theme {
	/* Light Theme Semantic */
	--color-background: var(--color-neutral-50);
	--color-surface: white;
	--color-surface-hover: var(--color-primary-50);
	--color-border: var(--color-neutral-200);
	--color-text: var(--color-neutral-900);
	--color-text-secondary: var(--color-neutral-700);
	--color-text-tertiary: var(--color-neutral-500);
	--color-accent: var(--color-primary-500);
	--color-accent-hover: var(--color-primary-600);
	--color-accent-pressed: var(--color-primary-700);

	/* Dark Theme Overrides */
	@dark {
		--color-background: var(--color-neutral-900);
		--color-surface: var(--color-neutral-800);
		--color-surface-hover: var(--color-neutral-700);
		--color-border: var(--color-neutral-600);
		--color-text: var(--color-neutral-50);
		--color-text-secondary: var(--color-neutral-300);
		--color-text-tertiary: var(--color-neutral-500);
		--color-accent: var(--color-primary-500);
		--color-accent-hover: var(--color-primary-400);
		--color-accent-pressed: var(--color-primary-300);
	}
}
```

---

## 6. Buttons

Buttons are critical interactive elements. Below are guidelines and example utility classes in Tailwind:

### 6.1 Button Types

1. **Primary Button**

   - Intended for main actions or calls to action.
   - Uses `--color-accent` for background, `--color-text` for text.
   - Hover/focus state uses `--color-accent-hover`.
   - Active/pressed state uses `--color-accent-pressed`.

2. **Secondary Button**

   - Used for secondary actions.
   - Typically an outline or a subtler background color.

3. **Ghost / Tertiary Button**

   - Minimal styling, text-only or with a faint background on hover.
   - Use neutral colors for text and a soft hover color.

4. **Destructive Button** (Optional)
   - For actions like “Delete” or “Remove.”
   - Typically red or an accent color that signals caution.

### 6.2 Example CSS (Using Tailwind + CSS Variables)

You can define component classes in a `components.css` or within the same file if you prefer:

```css
@layer components {
	.btn {
		@apply inline-flex items-center justify-center rounded-md font-medium shadow-sm transition-colors duration-200;
		padding: 0.5rem 1rem; /* or @apply px-4 py-2 */
		border-width: 1px;
		border-style: solid;
	}

	.btn-primary {
		background-color: var(--color-accent);
		color: var(--color-text);
		border-color: transparent;

		&:hover {
			background-color: var(--color-accent-hover);
		}
		&:active {
			background-color: var(--color-accent-pressed);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--color-accent);
		border-color: var(--color-accent);

		&:hover {
			background-color: var(--color-primary-50);
		}
		&:active {
			background-color: var(--color-primary-100);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.btn-ghost {
		background-color: transparent;
		color: var(--color-text);
		border-color: transparent;

		&:hover {
			background-color: var(--color-surface-hover);
		}
		&:active {
			background-color: var(--color-primary-100);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}
}
```

---

## 7. Common UI Components

### 7.1 Cards

```html
<div
	class="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[var(--color-text)] shadow-sm"
>
	<!-- Card content -->
</div>
```

**Tips**:

- Use `.p-4` or `.p-6` for spacing within the card.
- Add `hover:shadow-md` for hover states if clickable.

### 7.2 Modals / Dialogs

- **Background**: `var(--color-surface)` or `var(--color-neutral-50)` in light mode, `var(--color-neutral-800)` in dark mode.
- **Overlay**: A semi-transparent overlay `bg-[var(--color-neutral-900)]/[0.6]` for dark backgrounds in light mode (and vice versa if needed).
- **Padding & Border**: `.p-6 border-[var(--color-border)] rounded-lg shadow-lg`.

### 7.3 Forms

- **Labels**: `text-sm font-medium text-[var(--color-text-secondary)]`.
- **Inputs**:
  - Background: `var(--color-surface)`
  - Text: `var(--color-text)`
  - Border: `border border-[var(--color-border)]`
  - Focus: Outline or ring using `ring-2 ring-[var(--color-accent)]`.

---

## 8. Layout Recommendations

1. **Top Navigation / Header**

   - Typically `h-16` with `.flex .items-center .justify-between px-4` or `.px-6`.
   - Background: `var(--color-surface)`, border bottom `border-b-[var(--color-border)]`.

2. **Sidebar** (If used)

   - Width: `w-64` on desktop, collapsible on mobile.
   - Background: `var(--color-surface)`.
   - Use `.flex-col` and `.gap-2` for links.

3. **Main Content**

   - Use `.flex-1 .p-4` or `.p-6`.
   - Scrollable area if needed, with `.overflow-y-auto`.

4. **Footer**
   - Usually smaller than header; `.h-12 .flex .items-center .justify-center border-t border-[var(--color-border)]`.

---

## 9. Dark Mode Toggle

### 9.1 Implementation

- Toggle `.dark` class on the `<html>` or `<body>` element.
- All references to `@dark` or `:where(.dark, .dark *)` in the CSS will switch the theme automatically.

### 9.2 Example Toggle Code (React / JS)

```jsx
function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDark);
	}, [isDark]);

	return (
		<button onClick={() => setIsDark(!isDark)} className="btn btn-ghost">
			Toggle Theme
		</button>
	);
}
```

---

## 10. Next Steps

1. **Finalize the Tailwind Config**:

   - Add or tweak breakpoints, font families, or spacing scale in `tailwind.config.js` if needed.

2. **Implement Utility Classes**:

   - Move the example component styles (`.btn`, `.card`, etc.) into a dedicated layer in your CSS or add them to Tailwind’s plugin system.

3. **Apply to All Components**:

   - Ensure consistent usage of color variables, typography, spacing, and states across the entire app.

4. **Conduct Cross-Browser & Accessibility Testing**:

   - Verify the OKLCH colors gracefully degrade on older browsers.
   - Use the appropriate fallback or Progressive Enhancement approach.
   - Check color contrasts (especially for text) using WCAG guidelines.

5. **Enhance and Extend**:
   - Add more specialized components (alerts, toast notifications, tables, etc.) using the same color and typography system.

---

## Final Thoughts

With these comprehensive guidelines, we have a near-complete design system reference: from color variables and theme toggling to typography, spacing, and component-specific styling (e.g., buttons, cards, modals). By following this document, developers and designers can work cohesively to maintain a polished, consistent, and accessible user interface in Tailwind CSS v4.

Feel free to adapt and refine any details (like exact spacing, font sizes, or button shapes) to align perfectly with your brand and user needs.
