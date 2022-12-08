import { Main } from './main';
import { Maigc } from './plugin/Magic';
import { CharacterInfoPanelPolishing } from './plugin/CharacterInfoPanelPolishing';

async function main() {
    const main = new Main({ plugins: [CharacterInfoPanelPolishing, Maigc] });
    main.start();
}

main();
