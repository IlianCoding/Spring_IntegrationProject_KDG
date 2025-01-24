import {createTheme} from '@mui/material/styles';

const gameTheme = createTheme({
    palette: {
        primary: {
            main: '#4B0082',
        },
    },
    typography: {
        fontFamily: 'MedievalSharp, cursive',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    height: '90px',
                    color: '#ff9d45',
                    fontFamily: 'MedievalSharp, cursive',
                    fontSize: '1.4rem',
                    border: 'none',
                    backgroundImage: 'url(/assets/medieval-button.png)',
                    backgroundSize: '300% 180%',
                    backgroundPosition: '0% 0%',
                    '&:hover': {
                        backgroundPosition: '48.75% 0%',
                        color: '#FFD700',
                    },
                    '&:disabled': {
                        backgroundPosition: '97.5% 0%',
                        color: '#A9A9A9',
                    },
                    '&.style2': {
                        backgroundPosition: '0% 100%',
                        color: '#ff9d45',
                        '&:hover': {
                            backgroundPosition: '48.75% 100%',
                            color: '#FFD700',
                        },
                        '&:disabled': {
                            backgroundPosition: '97.5%% 100%',
                            color: '#A9A9A9',
                        },
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4B0082 !important',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#4B0082 !important',
                    color: '#fff !important',
                    fontFamily: 'MedievalSharp, cursive !important',
                },
                arrow: {
                    color: '#4B0082 !important',
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    color: '#4B0082 !important',
                    fontFamily: 'MedievalSharp, cursive !important',
                    position: 'static',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f5f5dc',
                    borderRadius: '8px',
                    color: '#4B0082',
                    fontFamily: 'MedievalSharp, cursive',
                    '& .MuiInputBase-input': {
                        color: '#4B0082',
                    },
                    '& .MuiInputLabel-root': {
                        color: '#4B0082',
                        fontFamily: 'MedievalSharp, cursive',
                        '&.Mui-focused': {
                            color: '#7e00dc',
                        },
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#4B0082',
                            borderRadius: '8px',
                        },
                        '&:hover fieldset': {
                            borderColor: '#7e00dc',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3A0066',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: 'MedievalSharp, cursive',
                    fontSize: '1rem',
                    color: '#4B0082',
                    borderColor: '#4B0082',
                    cursor: 'url(\'/assets/Medieval-pointer-resized.cur\'), auto',
                    '&:hover': {
                        backgroundColor: '#4B0082',
                        color: 'white',
                    },
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#4B0082',
                        color: 'white',
                    },
                },
            },
        },
    },
});

export default gameTheme;