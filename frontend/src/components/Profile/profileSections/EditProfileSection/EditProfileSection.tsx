import {useForm} from 'react-hook-form';
import {Box, Card, CardContent, Typography} from '@mui/material';
import {Profile} from '../../../../model/profile/Profile.ts';
import {Channel} from '../../../../model/enum/Channel.ts';
import {zodResolver} from '@hookform/resolvers/zod';
import FormField from './FormField.tsx';
import ActionButtons from './ActionButtons.tsx';
import {profileSchemaBe, profileSchemaEn} from "../EditProfileSchema.ts";
import {useTranslation} from "react-i18next";

interface EditProfileSectionProps {
    profile: Profile;
    onSave: (updatedProfile: Partial<Profile>) => void;
    onCancel: () => void;
}

function EditProfileSection({profile, onSave, onCancel}: EditProfileSectionProps) {
    const {i18n, t} = useTranslation();
    const profileSchema = i18n.language === 'be' ? profileSchemaBe : profileSchemaEn;

    const {control, handleSubmit, formState: {errors}} = useForm<Profile>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile.name || '',
            birthday: Array.isArray(profile.birthday) ? new Date(profile.birthday[0], profile.birthday[1], profile.birthday[2]) : new Date(profile.birthday),
            channel: profile.channel || Channel.MAIL
        }
    });

    const fields = [
        {name: 'name', placeholder: t('Name'), required: true},
        {name: 'birthday', placeholder: t('Birthday'), required: true},
        {name: 'channel', placeholder: t('Channel'), required: true},
    ];

    const onSubmit = (data: Partial<Profile>) => {
        onSave(data);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{width: '100%', pt: 2}}>
            <Box display="flex" flexDirection="column" gap={2}>
                <Card className={"profile-background"}>
                    <CardContent>
                        <Typography variant="h6" sx={{mb: 2}}>Edit Profile</Typography>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                {fields.map((field, index) => (
                                    <FormField key={index} field={field} control={control} errors={errors}/>
                                ))}
                            </Box>
                            <ActionButtons onCancel={onCancel}/>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default EditProfileSection;