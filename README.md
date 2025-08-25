# Tailwind CSS Setup

This project has been successfully configured with Tailwind CSS.

## Files Created

- `tailwind.config.js` - Tailwind configuration file
- `postcss.config.js` - PostCSS configuration
- `src/input.css` - Source CSS file with Tailwind directives
- `dist/output.css` - Compiled CSS file (generated)
- `package.json` - NPM configuration with build scripts

## Available Scripts

- `npm run build` - Build CSS once
- `npm run build-css` - Build CSS and watch for changes

## Usage

1. Add Tailwind classes to your HTML elements
2. Run `npm run build` to compile the CSS
3. Open `index.html` in your browser to see the result

## Example Classes

- Layout: `flex`, `grid`, `container`, `mx-auto`
- Spacing: `p-4`, `m-2`, `space-y-4`
- Colors: `bg-blue-500`, `text-gray-800`, `border-gray-300`
- Typography: `text-xl`, `font-bold`, `text-center`
- Responsive: `md:grid-cols-3`, `sm:text-sm`

## Development

To start development with automatic rebuilding:
```bash
npm run build-css
```

This will watch for changes in your HTML/CSS files and rebuild automatically.
