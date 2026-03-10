import fs from 'fs';
import path from 'path';

const SEARCH_DIR = 'C:\\Users\\jaisu\\Projects\\lexfix\\app';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (content.match(/>\s*Lexfix\s*<\//)) {
                
                // Add Sparkles import from lucide-react
                if (content.includes('lucide-react')) {
                    if (!content.includes('Sparkles') && content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/)) {
                        content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/, (match, group) => {
                            return `import { ${group}, Sparkles } from 'lucide-react'`;
                        });
                        modified = true;
                    }
                } else {
                    const importStatement = `import { Sparkles } from 'lucide-react';\n`;
                    const lastImportIndex = content.lastIndexOf('import ');
                    if (lastImportIndex !== -1) {
                        const nextNewline = content.indexOf('\n', lastImportIndex);
                        content = content.slice(0, nextNewline + 1) + importStatement + content.slice(nextNewline + 1);
                    } else {
                        content = importStatement + content;
                    }
                    modified = true;
                }

                // Replace the text logo with icon component
                content = content.replace(/>\s*Lexfix\s*<\/Link>/g, `>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>LinguaAccess</span>
            </div>
          </Link>`);

                content = content.replace(/>\s*Lexfix\s*<\/span>/g, `>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>LinguaAccess</span>
            </div>
          </span>`);

                content = content.replace(/>\s*Lexfix\s*<\/h1>/g, `>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#5a8c5c]" />
              <span>LinguaAccess</span>
            </div>
          </h1>`);

                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

console.log('Replacing Lexfix text with professional icons...');
processDirectory(SEARCH_DIR);
console.log('Done!');
