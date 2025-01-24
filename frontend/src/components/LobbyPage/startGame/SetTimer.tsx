import {z} from "zod";
import {useSetDuration, useStartGame} from "../../../hooks/useLobbyActions.ts";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, CircularProgress, FormControl, FormHelperText, TextField, Tooltip} from "@mui/material";
import {Game} from "../../../model/game/Game.ts";
import {useContext, useEffect, useState} from "react";
import lobbyContext from "../../../contexts/lobby/LobbyContext.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useGetLatestGameOfLobby} from "../../../hooks/useGame.ts";
import {Profile} from "../../../model/profile/Profile.ts";

const fields = [
    {name: 'turnDuration', placeholder: 'Turn duration', required: true},
];
const timerSchema = z.object({
    turnDuration: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1, "Turn duration must at least 1 be minute").max(10080, "Turn duration must at most be 10080 minutes"))
})

interface SetTimerProps {
    players: Profile[];
}

export function SetTimer({players}: SetTimerProps) {
    const {t} = useTranslation();
    const {
        mutate: getLatestGame,
        isError: isErrorLatestGame,
        isPending: isPendingLatestGame,
        data: game
    } = useGetLatestGameOfLobby();
    const {mutate, isPending, isError} = useSetDuration();
    const {
        mutate: startGame,
        isPending: isPendingStartGame,
        isError: isErrorStartGame,
        isSuccess: isSuccessStartGame
    } = useStartGame();
    const navigate = useNavigate();
    const {lobbyId} = useContext(lobbyContext)
    const [showForm, setShowForm] = useState(false);
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<Game>({
        resolver: zodResolver(timerSchema),
        defaultValues: {
            turnDuration: 5
        },
    })

    const onSubmitHandler = (formData: Game) => {
        mutate({lobbyId: lobbyId ?? "", duration: formData.turnDuration}, {
            onSuccess: () => {
                startGame(lobbyId ?? "");
            }
        });
    };

    useEffect(() => {
        if (isSuccessStartGame && game) {
            navigate(`/game/${game.id}`);
        }
    }, [game, isSuccessStartGame, navigate]);

    const handleOnClick = () => {
        getLatestGame(lobbyId ?? "");
        setShowForm(true);
    };

    if (isPending || isPendingStartGame || isPendingLatestGame) return <CircularProgress/>;
    if (isError) return <Box>{t("Error setting duration")}</Box>;
    if (isErrorStartGame) return <Box>{t("Error starting game")}</Box>;
    if (isErrorLatestGame) return <Box>{t("Error getting game")}</Box>;

    return (
        <Box>
            {!showForm ? (
                <Tooltip
                    title={players && players.length < 3 ? t("You need a minimum of 3 players to start a game") : ""}>
                    <span>
                        <Button onClick={handleOnClick} disabled={players && players.length < 3}>
                            {t("Set turn duration and start game")}
                        </Button>
                    </span>
                </Tooltip>
            ) : (
                <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
                    <Box display="flex" alignItems="center" gap={2}>
                        {fields.map((field, index) => {
                            if (field.name === 'turnDuration') {
                                return (
                                    <Controller
                                        key={index}
                                        name="turnDuration"
                                        control={control}
                                        render={({field: controllerField}) => (
                                            <FormControl error={!!errors.turnDuration} sx={{width: '200px'}}>
                                                <TextField
                                                    {...controllerField}
                                                    type="number"
                                                    aria-label={t(field.placeholder)}
                                                    label={t(field.placeholder)}
                                                    required={field.required || false}
                                                    placeholder={t(field.placeholder)}
                                                    error={!!errors.turnDuration}
                                                    helperText={errors.turnDuration ? errors.turnDuration.message : ""}
                                                    slotProps={{
                                                        inputLabel: {
                                                            shrink: true
                                                        },
                                                        htmlInput: {
                                                            min: 1,
                                                            max: 10080,
                                                        },
                                                    }}
                                                />
                                                <FormHelperText>{errors.turnDuration ? errors.turnDuration.message : ""}</FormHelperText>
                                            </FormControl>
                                        )}
                                    />
                                );
                            }
                        })}
                        <Button type="submit" variant="contained">{t("Start Game")}</Button>
                    </Box>
                </form>
            )}
        </Box>
    )
}