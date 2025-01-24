import * as yup from "yup";

const schemaBePrediction = yup.object().shape({
    min_age: yup.number().integer().min(0, "Minimale leeftijd kan niet kleiner dan 0 zijn!").required("Minimale leeftijd is verplicht"),
    users_rated: yup.number().integer().min(0, "Aantal gebruikers kan niet kleiner dan 0 zijn!").required("Aantal gebruikers is verplicht"),
    play_time: yup.number().integer().min(0, "Speeltijd kan niet kleiner dan 0 zijn!").required("Speeltijd is verplicht"),
    domains: yup.array().of(yup.string().required()).min(1, "Selecteer minstens één domein!").required().default([]),
    mechanics: yup.array().of(yup.string().required()).min(1, "Selecteer minstens één mechanisme!").required().default([])
})

const schemaEnPrediction = yup.object().shape({
    min_age: yup.number().integer().min(0, "Minimum age cannot be less than 0!").required("Minimum age is required"),
    users_rated: yup.number().integer().min(0, "Number of users cannot be less than 0!").required("Number of users is required"),
    play_time: yup.number().integer().min(0, "Play time cannot be less than 0!").required("Play time is required"),
    domains: yup.array().of(yup.string().required()).min(1, "Select at least one domain!").required().default([]),
    mechanics: yup.array().of(yup.string().required()).min(1, "Select at least one mechanism!").required().default([])
})

export { schemaBePrediction, schemaEnPrediction };