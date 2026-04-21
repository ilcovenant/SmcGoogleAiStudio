
import { execSync } from 'child_process';

const files = ['logo.png', 'icon-512.png', 'screen1desktop.png', 'screen1mobile.png'];

for (const file of files) {
  try {
    console.log(`Attempting to fix status for: ${file}`);
    // Usiamo 'git add' per rimettere il file nello staging ed eliminare lo stato 'Deleted'
    const output = execSync(`git add ${file}`).toString();
    console.log(`Success: ${output || 'No output'}`);
  } catch (error: any) {
    console.error(`Error fixing ${file}: ${error.stderr?.toString() || error.message}`);
  }
}
