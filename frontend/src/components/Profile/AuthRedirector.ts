import {useContext, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useProfileExists} from "../../hooks/useProfile.ts";
import SecurityContext from "../../contexts/SecurityContext.ts";

export function AuthRedirector() {
    const {userEmail} = useContext(SecurityContext);
    const {mutate, isSuccess, data} = useProfileExists();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (userEmail !== undefined && location.pathname !== "/register") {
            mutate(userEmail);
        }
    }, [userEmail]);

    useEffect(() => {
        if (data !== undefined && !data && userEmail && location.pathname !== "/register") {
            navigate('/register');
        }
    }, [isSuccess]);

    return null;
}