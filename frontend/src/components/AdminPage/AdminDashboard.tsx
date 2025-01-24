import {useContext, useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";
import {schemaBePrediction, schemaEnPrediction} from "./adminboardSections/FormPredictionSchema.ts";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import securityContext from "../../contexts/SecurityContext.ts";
import Navbar from "../navigation/Navbar.tsx";

const API_URL = "/admin/predict"

const domainsOptions = [
    "Strategy Games",
    "Thematic Games",
    "Wargames",
    "Family Games",
    "Customizable Games",
    "Children's Games",
    "Abstract Games",
    "Party Games",
];

const mechanicsOptions = [
    "Specialized Mechanics",
    "Interaction and Conflict",
    "Strategic Elements",
    "Other",
    "Game Progression and Mechanics",
    "Action and Turn Management",
    "Resource Management",
    "Auxiliary Mechanics",
    "Movement and Positioning",
    "Narrative and Thematic",
];

interface PredictionResult {
    prediction_average_rating: number;
    prediction_owned_users: number;
    prediction_complexity_average: number;
}

type FormData = {
    min_age: number;
    users_rated: number;
    play_time: number;
    domains: string[];
    mechanics: string[];
};

function getStarRating(value: number): string {
    const maxStars = 5;
    const stars = Math.max(0, Math.min(maxStars, Math.round(value)));
    return '★'.repeat(stars) + '☆'.repeat(maxStars - stars);
}

export function AdminDashboard() {
    const {i18n, t} = useTranslation();
    const adminSchema = i18n.language === 'be' ? schemaBePrediction : schemaEnPrediction;
    const [openDialog, setOpenDialog] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const {
        isAuthenticated,
        userName,
        loading,
        login,
        hasRole
    } = useContext(securityContext);


    const {
        handleSubmit,
        control,
        reset,
        formState: {errors},
    } = useForm<FormData>({
        resolver: yupResolver(adminSchema),
        defaultValues: {
            min_age: 0,
            users_rated: 0,
            play_time: 0,
            domains: [] as string[],
            mechanics: [] as string[],
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axios.post(`${API_URL}`, data);
            setResult(response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error("Er is een fout opgetreden bij het ophalen van de voorspellingen", error);
        } finally {
            reset();
        }
    };

    if (loading) {
        return <Typography>{t("Het laden van authenticatie...")}</Typography>;
    }

    if (!isAuthenticated()) {
        return (
            <>
                <Navbar/>
                <Container maxWidth="sm" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '20vh',
                    textAlign: 'center',
                    backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                    backgroundSize: 'cover',
                }}>
                    <Typography variant="h6">
                        {t("Je bent niet ingelogd")}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={login} sx={{mt: 2}}>
                        {t("Log in")}
                    </Button>
                </Container>
            </>
        );
    }

    if (!hasRole("admin")) {
        return (
            <>
                <Navbar/>
                <Container maxWidth="sm" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '20vh',
                    backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                    backgroundSize: 'cover',
                    borderRadius: '8px',
                    padding: '20px',
                }}>
                    <Typography variant="h6" sx={{color: '#4B0082'}}>
                        {t("Je hebt geen toegang tot dit dashboard.")}
                    </Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'left',
                backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                backgroundSize: 'cover',
                borderRadius: '8px',
                padding: '20px',
            }}>
                <Box>
                    <Typography variant="h4">
                        {t("Welkom")}, {userName}!
                    </Typography>
                    <Typography variant="body1" component={"p"} sx={{marginY: 2}}>
                        {t(
                            "Hier kun je voorspellingen maken over de populariteit van je spel op basis van ingevoerde gegevens."
                        )}
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={3}>
                        <Controller
                            name="min_age"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label={t("Minimale Leeftijd")}
                                    type="number"
                                    fullWidth
                                    error={!!errors.min_age}
                                    helperText={errors.min_age?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mb={3}>
                        <Controller
                            name="users_rated"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label={t("Aantal Gebruikers (Ratings)")}
                                    type="number"
                                    fullWidth
                                    error={!!errors.users_rated}
                                    helperText={errors.users_rated?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mb={3}>
                        <Controller
                            name="play_time"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label={t("Geschatte Speeltijd (minuten)")}
                                    type="number"
                                    fullWidth
                                    error={!!errors.play_time}
                                    helperText={errors.play_time?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box mb={3}>
                        <Controller
                            name="domains"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth error={!!errors.domains}>
                                    <InputLabel>{t("Domeinen")}</InputLabel>
                                    <Select {...field} multiple>
                                        {domainsOptions.map((domain) => (
                                            <MenuItem key={domain} value={domain}>
                                                {domain}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        {errors.domains && (
                            <p style={{color: "red"}}>{errors.domains.message}</p>
                        )}
                    </Box>
                    <Box mb={3}>
                        <Controller
                            name="mechanics"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth error={!!errors.mechanics}>
                                    <InputLabel>{t("Mechanics")}</InputLabel>
                                    <Select {...field} multiple>
                                        {mechanicsOptions.map((mechanic) => (
                                            <MenuItem key={mechanic} value={mechanic}>
                                                {mechanic}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        {errors.mechanics && (
                            <p style={{color: "red"}}>{errors.mechanics.message}</p>
                        )}
                    </Box>
                    <Button type="submit" variant="contained" color="primary">
                        {t("Verstuur")}
                    </Button>
                </form>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    PaperProps={{
                        style: {
                            backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                            backgroundSize: 'cover',
                            borderRadius: '8px',
                            padding: '20px',
                        },
                    }}
                >
                    <DialogTitle sx={{color: '#4B0082'}}>{t("Predictie Resultaten")}</DialogTitle>
                    <DialogContent>
                        {result ? (
                            <Box>
                                <Typography>
                                    {t("Gemiddelde Beoordeling")}: {getStarRating(result.prediction_average_rating)}
                                </Typography>
                                <Typography>
                                    {t("Voorspeld Aantal Gebruikers")}: {Math.round(result.prediction_owned_users)}
                                </Typography>
                                <Typography>
                                    {t("Gemiddelde Complexiteit")}: {getStarRating(result.prediction_complexity_average)}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography color="error">{t("Er is een fout opgetreden.")}</Typography>
                        )}
                        <Button onClick={() => setOpenDialog(false)}>{t("Sluiten")}</Button>
                    </DialogContent>
                </Dialog>
            </Container>
        </>
    );
}