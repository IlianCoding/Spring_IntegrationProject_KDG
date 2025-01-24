import {ReactElement} from 'react';
import {createTheme, Theme, ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';

const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#4B0082',
        },
        mode: 'light',
        background: {
            default: '#808080',
        },
        text: {
            primary: '#333333',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: '#4B0082',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontFamily: 'MedievalSharp, cursive',
                    border: '2px solid #3A0066',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        backgroundColor: '#3A0066',
                        borderColor: '#2A004D',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'
                    },
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
        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    '& .MuiSelect-select': {
                        color: '#333333',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#007BFF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0056b3',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#333333',
                    '&.Mui-focused': {
                        color: '#0056b3',
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'MedievalSharp, cursive',
                    color: '#4B0082',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#4B0082',
                    border: '2px solid #3A0066',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: 'MedievalSharp, cursive',
                    color: 'white',
                    '&:hover': {
                        cursor: 'url(\'/assets/Medieval-pointer-resized.cur\'), auto',
                        backgroundColor: '#3A0066',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    fontFamily: 'MedievalSharp, cursive',
                    color: '#4B0082',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: 'MedievalSharp, cursive',
                    color: '#4B0082',
                    '&.Mui-selected': {
                        color: '#7e00dc',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&.MuiTableRow-head': {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        height: '70px',
                    },
                    '&.MuiTableRow-body': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        height: '70px',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontFamily: 'MedievalSharp, cursive',
                    color: '#4B0082',
                    border: '2px solid #3A0066',
                    fontSize: '1.6em',
                    padding: '16px',
                    '&.MuiTableCell-root': {
                        fontFamily: 'MedievalSharp, cursive',
                        color: '#4B0082',
                        border: '2px solid #3A0066',
                        fontSize: '1.6em',
                        padding: '16px',
                    },
                },
                head: {
                    textAlign: 'center',
                    width: '80px',
                },
            },
        },
    },
});

interface IWithChildren {
    children: ReactElement | ReactElement[];
    theme?: Theme;
}

export default function DefaultThemeProvider({children}: IWithChildren) {
    return (
        <MuiThemeProvider theme={lightTheme}>
            <CssBaseline/>
            {children}
        </MuiThemeProvider>
    );
}