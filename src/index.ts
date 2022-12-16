import { Main } from './Main';
import { Maigc } from './plugin/Magic';
import { CharacterInfoPanelPolishing } from './plugin/CharacterInfoPanelPolishing';
import { MoreMagic } from './plugin/MoreMagic';
import { MagicFX } from './plugin/MagicFx';
import { BattleBGM } from './plugin/BattleBGM';

async function main() {
    const main = new Main({ plugins: [CharacterInfoPanelPolishing, Maigc, MoreMagic, MagicFX, BattleBGM] });
    main.start();
}

main();

//CharacterInfoPanelPolishing, Maigc, MoreMagic, MagicFX, BattleBGM
