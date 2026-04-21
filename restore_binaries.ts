
import fs from 'fs';

const pairs = [
  ['logo_backup.png', 'logo.png'],
  ['icon-512_backup.png', 'icon-512.png'],
  ['screen1desktop_backup.png', 'screen1desktop.png'],
  ['screen1mobile_backup.png', 'screen1mobile.png']
];

for (const [src, dest] of pairs) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Restored ${dest} from ${src}`);
      fs.unlinkSync(src);
    }
  } catch (e) {
    console.error(`Error restoring ${dest}:`, e);
  }
}
