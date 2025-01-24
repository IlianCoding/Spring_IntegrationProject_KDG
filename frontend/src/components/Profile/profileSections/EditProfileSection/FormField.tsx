import { Controller, Control, FieldErrors } from "react-hook-form";
import { Profile } from "../../../../model/profile/Profile.ts";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Channel } from "../../../../model/enum/Channel.ts";

interface FormFieldProps {
    field: { name: string, placeholder: string, required: boolean };
    control: Control<Profile>;
    errors: FieldErrors<Profile>;
}

function FormField({ field, control, errors }: FormFieldProps) {
    const getErrorMessage = (name: keyof Profile) => {
        const error = errors[name];
        return typeof error?.message === 'string' ? error.message : '';
    };

    if (field.name === 'channel') {
        return (
            <Controller
                name={field.name as keyof Profile}
                control={control}
                render={({ field: controllerField }) => (
                    <FormControl fullWidth error={!!errors[field.name as keyof Profile]}>
                        <InputLabel id={`${field.name}-label`}>{field.placeholder}</InputLabel>
                        <Select
                            {...controllerField}
                            labelId={`${field.name}-label`}
                            id={field.name}
                        >
                            {Object.values(Channel).map((ch) => (
                                <MenuItem key={ch} value={ch}>
                                    {ch}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{getErrorMessage(field.name as keyof Profile)}</FormHelperText>
                    </FormControl>
                )}
            />
        );
    }

    if (field.name === 'birthday') {
        return (
            <Controller
                name={field.name as keyof Profile}
                control={control}
                render={({ field: controllerField }) => (
                    <FormControl fullWidth error={!!errors[field.name as keyof Profile]}>
                        <TextField
                            {...controllerField}
                            type="date"
                            aria-label={field.placeholder}
                            label={field.placeholder}
                            error={!!errors[field.name as keyof Profile]}
                            required={field.required || false}
                            id={field.name}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            value={controllerField.value instanceof Date || typeof controllerField.value === 'string' || typeof controllerField.value === 'number'
                                ? new Date(controllerField.value).toISOString().split('T')[0]
                                : ''
                            }
                        />
                        <FormHelperText>{getErrorMessage(field.name as keyof Profile)}</FormHelperText>
                    </FormControl>
                )}
            />
        );
    }

    return (
        <Controller
            name={field.name as keyof Profile}
            control={control}
            render={({ field: controllerField }) => (
                <FormControl fullWidth error={!!errors[field.name as keyof Profile]}>
                    <TextField
                        {...controllerField}
                        aria-label={field.placeholder}
                        label={field.placeholder}
                        error={!!errors[field.name as keyof Profile]}
                        required={field.required || false}
                        id={field.name}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <FormHelperText>{getErrorMessage(field.name as keyof Profile)}</FormHelperText>
                </FormControl>
            )}
        />
    );
}

export default FormField;