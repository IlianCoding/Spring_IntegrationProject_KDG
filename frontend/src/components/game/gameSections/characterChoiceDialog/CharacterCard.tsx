import {Card, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";
import {Character} from "../../../../model/game/character/Character.ts";
import {useTranslation} from 'react-i18next';

interface CharacterCardProps {
    character: Character,
    chosen: boolean,
    onClick?: () => void
}

export function CharacterCard({character, chosen, onClick}: CharacterCardProps) {
    const {t} = useTranslation();

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 220,
                maxHeight: 440,
                cursor: 'url(\'/assets/Medieval-pointer-resized.cur\'), auto',
                border: chosen ? '3px solid lightblue' : '1px solid black',
                boxShadow: chosen ? '0 4px 12px rgba(0, 0, 255, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.2)',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'top-align'
            }}

            onClick={onClick}
        >
            <CardHeader
                title={t(character.name)}
                sx={{fontWeight: 'bold'}}
            />
            <CardMedia
                component="img"
                image={character.image}
                height="200"
                alt={t(character.name)}
                sx={{
                    objectFit: 'cover',
                    borderRadius: '4px'
                }}
            />
            <CardContent>
                <Typography sx={{fontSize: 14, color: '#666'}}>
                    {t(character.description)}
                </Typography>
            </CardContent>
        </Card>
    )
}