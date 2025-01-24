import {z} from 'zod';
import {Channel} from '../../../model/enum/Channel.ts';

const profileSchemaEn = z.object({
    name: z.string().min(1, "Name cannot be empty").max(50, "Name must be 50 characters or less"),
    birthday: z.preprocess((val) => new Date(val as string), z.date().refine(date => date <= new Date(), "Birthday cannot be in the future")),
    channel: z.nativeEnum(Channel, {message: "Invalid channel value"})
});

const profileSchemaBe = z.object({
    name: z.string().min(1, "Naam mag niet leeg zijn").max(50, "Naam mag maximaal 50 tekens bevatten"),
    birthday: z.preprocess((val) => new Date(val as string), z.date().refine(date => date <= new Date(), "Verjaardag mag niet in de toekomst liggen")),
    channel: z.nativeEnum(Channel, {message: "Ongeldige kanaalwaarde"})
});

export {profileSchemaEn, profileSchemaBe};