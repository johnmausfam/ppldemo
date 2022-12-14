import { Main } from './main';
import { Maigc } from './plugin/Magic';
import { CharacterInfoPanelPolishing } from './plugin/CharacterInfoPanelPolishing';
import { MoreMagic } from './plugin/MoreMagic';
import { MagicFX } from './plugin/MagicFx';

async function main() {
    const main = new Main({ plugins: [CharacterInfoPanelPolishing, Maigc, MoreMagic, MagicFX] });
    main.start();
}

main();
