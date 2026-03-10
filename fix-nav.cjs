const fs = require('fs');
const glob = require('glob');

const files = [
    'd:/sem6/software eng/dev2/app/learner/settings/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/progress/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/profile/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/practice/writing/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/practice/pronunciation/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/lessons/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/dashboard/page.tsx',
    'd:/sem6/software eng/dev2/app/learner/achievements/page.tsx'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf-8');
    let original = content;

    // Change "sticky top-0" to "fixed top-0 left-0 w-full z-50"
    content = content.replace(/sticky top-0 z-[0-9]+/g, 'fixed top-0 left-0 w-full z-50');

    // Add pt-[76px] to the outer wrapper min-h-screen bg-[#faf9f7] if it doesn't already have it
    // This is required to push the content down below the newly fixed navbar
    if (content.indexOf('pt-[76px]') === -1) {
        content = content.replace(/className=\"min-h-screen bg-\[#faf9f7\]\"/, 'className=\"min-h-screen bg-[#faf9f7] pt-[76px]\"');
    }

    if (original !== content) {
        fs.writeFileSync(f, content);
        console.log('Updated ' + f);
    } else {
        console.log('No changes in ' + f);
    }
});
