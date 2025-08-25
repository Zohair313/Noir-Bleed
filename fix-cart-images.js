 // Script to fix all product detail pages with incorrect image paths
const fs = require('fs');
const path = require('path');

// List of files to fix (from the search results)
const filesToFix = [
    'product2detail.html',
    'product3detail.html',
    'product4detail.html',
    'product5detail.html',
    'product6detail.html',
    'product7detail.html',
    'product8detail.html',
    'fproduct2detail.html',
    'fproduct3detail.html',
    'fproduct4detail.html',
    'fproduct5detail.html',
    'fproduct6detail.html',
    'fproduct7detail.html',
    'fproduct8detail.html',
    'product4detail-fixed.html',
    'product4detail-final.html',
    'product4detail-corrected.html',
    'product4detail-clean.html',
    'product4detail-clean-final.html'
];

// The pattern to search for and replace
const searchPattern = /image:.*\.src\.split.*pop.*/;
const replacement = 'image: document.querySelector("img").src, // Full image path';

console.log('Starting to fix cart image paths...');
console.log(`Found ${filesToFix.length} files to process`);

let fixedCount = 0;
let errorCount = 0;

filesToFix.forEach(filename => {
    try {
        const filePath = path.join(__dirname, filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filename}`);
            return;
        }

        // Read file content
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file needs fixing
        if (content.includes('.src.split("/").pop()')) {
            // Replace the problematic line
            const newContent = content.replace(searchPattern, replacement);
            
            // Write back to file
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Fixed: ${filename}`);
            fixedCount++;
        } else {
            console.log(`ℹ️  Already fixed or no issue: ${filename}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
        errorCount++;
    }
});

console.log('\n=== Fix Summary ===');
console.log(`Total files processed: ${filesToFix.length}`);
console.log(`Files successfully fixed: ${fixedCount}`);
console.log(`Files with errors: ${errorCount}`);
console.log('===================');

if (errorCount === 0) {
    console.log('🎉 All files processed successfully!');
} else {
    console.log('⚠️  Some files had errors. Check the logs above.');
}
