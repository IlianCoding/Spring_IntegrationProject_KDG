import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect, useRef} from 'react';
import {IconButton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = useRef(location.pathname);

    useEffect(() => {
        previousPath.current = location.pathname;
    }, [location.pathname]);

    const handleBackClick = () => {
        if (previousPath.current === '/profile') {
            navigate('/profile');
        } else if (previousPath.current === '/') {
            navigate('/');
        } else {
            navigate(-1);
        }
    };

    return (
        <IconButton onClick={handleBackClick}
                    sx={{mr: 2, fontFamily: 'MedievalSharp, cursive', color: '#4B0082'}}>
            <ArrowBackIcon fontSize="large"/>
        </IconButton>
    );
}

export default BackButton;