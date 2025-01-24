import CharacterAssassin from './CharacterAssassin.tsx';
import CharacterThief from './CharacterThief.tsx';
import CharacterMagician from './MagicianAction/CharacterMagician.tsx';
import CharacterWarlord from './CharacterWarlord.tsx';
import {useCharacterActionContext} from '../../../../../hooks/useCharacterActionContext.ts';
import './characterAction.css';
import CharacterKing from "./CharacterKing.tsx";
import CharacterBishop from "./CharacterBishop.tsx";
import CharacterMerchant from "./CharacterMerchant.tsx";
import CharacterArchitect from "./CharacterArchitect.tsx";

function CharacterActions() {
    const {
        selectedCharacter,
    } = useCharacterActionContext();

    if (!selectedCharacter) {
        return null;
    }

    switch (selectedCharacter.number) {
        case 1:
            return <CharacterAssassin/>;
        case 2:
            return <CharacterThief/>;
        case 3:
            return <CharacterMagician/>;
        case 4:
            return <CharacterKing/>;
        case 5:
            return <CharacterBishop/>;
        case 6:
            return <CharacterMerchant/>;
        case 7:
            return <CharacterArchitect/>;
        case 8:
            return <CharacterWarlord/>;
        default:
            return null;
    }
}

export default CharacterActions;