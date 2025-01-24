import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Profile} from "../../model/profile/Profile.ts";
import {Channel} from "../../model/enum/Channel.ts";
import SecurityContext from "../../contexts/SecurityContext.ts";
import {useContext, useEffect} from "react";
import {useCreateProfile} from "../../hooks/useProfile.ts";
import {Box, Button, CircularProgress, Container, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";

const MIN_LENGHT_MESSAGE = (length: number) => `Please enter minimum ${length} characters.`;
const EMAIL_MESSAGE = "Please enter a valid email address"
const fields = [
    {name: 'userName', placeholder: 'Username', required: true},
    {name: 'name', placeholder: 'Name (as found on your id)', required: true},
    {name: 'email', placeholder: 'Email', required: true},
    {name: 'birthday', placeholder: 'Birthday', required: true},
    {name: 'channel', placeholder: 'Communication channel', required: true}
];

const profileSchema = z.object({
    userName: z.string().min(2, MIN_LENGHT_MESSAGE(2)),
    name: z.string().min(4, MIN_LENGHT_MESSAGE(4)),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, EMAIL_MESSAGE),
    birthday: z.string(),
    channel: z.nativeEnum(Channel)
})

const formatDate = (date: Date) => {
    return new Date(date.toISOString().split('T')[0]); // Formats to yyyy-MM-dd
};


export function RegisterPage() {
    const {userId, userName, userUsername, userEmail} = useContext(SecurityContext)
    const {mutate, isPending, isError, isSuccess} = useCreateProfile();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<Profile>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            userName: userUsername,
            name: userName,
            email: userEmail,
            birthday: formatDate(new Date('01-01-2000')),
            channel: Channel.DISCORD
        },
    })
    const onSubmitHandler = (data: Profile) => {
        const id = userId ?? "";
        const formattedData = {
            ...data,
            birthday: formatDate(new Date(data.birthday))
        };
        mutate({...formattedData, id});
    };

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);

    if (isPending) return <CircularProgress/>;
    if (isError) return <div>Error loading profile</div>;
    return (
        <Container maxWidth="sm">
            <h1>Just a few more steps and you'll be ready to go</h1>
            <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {fields.map((field, index) => {
                        if (field.name === 'channel') {
                            return (
                                <Controller
                                    key={index}
                                    name={field.name as keyof Profile}
                                    control={control}
                                    render={({field: controllerField}) => (
                                        <div>
                                            <InputLabel>{field.placeholder}</InputLabel>
                                            <Select {...controllerField} error={!!errors.channel}>
                                                {Object.values(Channel).map((channel) => (
                                                    <MenuItem key={channel} value={channel}>{channel}</MenuItem>
                                                ))}
                                            </Select>
                                            {errors.channel && <span>{errors.channel.message}</span>}
                                        </div>
                                    )}
                                />
                            );
                        }
                        if (field.name === 'birthday') {
                            return (
                                <Controller
                                    key={index}
                                    name={field.name as keyof Profile}
                                    control={control}
                                    render={({field: controllerField}) => (
                                        <div>
                                            <InputLabel>{field.placeholder}</InputLabel>
                                            <TextField
                                                {...controllerField}
                                                type="date"
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true,
                                                    },
                                                }}
                                                required={field.required || false}
                                                placeholder={field.placeholder}
                                                error={!!errors.birthday}
                                                helperText={errors.birthday ? errors.birthday.message : ""}
                                            />
                                            {errors.birthday && <span>{errors.birthday.message}</span>}
                                        </div>
                                    )}
                                />
                            );
                        }
                        return (
                            <Controller
                                key={index}
                                name={field.name as keyof Profile}
                                control={control}
                                render={({field: controllerField}) => (
                                    <div>
                                        <InputLabel>{field.placeholder}</InputLabel>
                                        <TextField
                                            {...controllerField}
                                            value={field.name === 'userName' ? userUsername : field.name === 'name' ? userName : field.name === 'email' ? userEmail : controllerField.value}
                                            error={!!errors[field.name as keyof Profile]}
                                            helperText={errors[field.name as keyof Profile]?.message}
                                            required={field.required}
                                            disabled={true}
                                        />
                                    </div>
                                )}
                            />
                        );
                    })}
                </Box>
                <Button type="submit" variant="contained">
                    Add info
                </Button>
            </form>
        </Container>
    )
}