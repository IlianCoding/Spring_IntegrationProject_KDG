import {ReactNode, useEffect, useState} from 'react';
import SecurityContext from './SecurityContext.ts';
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from '../services/auth.ts';
import {isExpired} from 'react-jwt';
import Keycloak from 'keycloak-js';
import {useTranslation} from 'react-i18next';
import {useUpdateLocale} from '../hooks/useProfile.ts';

interface IWithChildren {
    children: ReactNode;
}

const keycloakConfig = {
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
};
const keycloak: Keycloak = new Keycloak(keycloakConfig);

export default function SecurityContextProvider({children}: IWithChildren) {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [userName, setUserName] = useState<string | undefined>(undefined)
    const [userUsername, setUserUserName] = useState<string | undefined>(undefined)
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined)
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const {i18n} = useTranslation();
    const {mutate: updateLocale} = useUpdateLocale();

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale) {
            i18n.changeLanguage(savedLocale);
        } else if (userId) {
            i18n.changeLanguage('en');
            localStorage.setItem('locale', 'en');
            if (isAuthenticated()) {
                updateLocale({profileId: userId, localeString: 'en'});
            }
        }
    }, [i18n, updateLocale, userId]);

    useEffect(() => {
        keycloak.init({
            onLoad: 'check-sso',
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        }).then(authenticated => {
            setLoading(false);
            if (authenticated) {
                addAccessTokenToAuthHeader(keycloak.token);
                setUserId(keycloak.idTokenParsed?.sub);
                setUserName(keycloak.idTokenParsed?.name);
                setUserUserName(keycloak.idTokenParsed?.preferred_username);
                setUserEmail(keycloak.idTokenParsed?.email);
                const realmRoles = keycloak.realmAccess?.roles || [];
                setRoles(realmRoles);
            }
        }).catch(() => setLoading(false));

        const intervalId = setInterval(() => {
            if (keycloak.token && isExpired(keycloak.token)) {
                keycloak.updateToken(-1).then(() => {
                    addAccessTokenToAuthHeader(keycloak.token);
                    setUserId(keycloak.idTokenParsed?.sub);
                    setUserName(keycloak.idTokenParsed?.name);
                    setUserUserName(keycloak.idTokenParsed?.preferred_username);
                    setUserEmail(keycloak.idTokenParsed?.email);
                }).catch(() => {
                    removeAccessTokenFromAuthHeader();
                });
            }
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    keycloak.onAuthSuccess = () => {
        addAccessTokenToAuthHeader(keycloak.token);
        setUserId(keycloak.idTokenParsed?.sub);
        setUserName(keycloak.idTokenParsed?.name)
        setUserUserName(keycloak.idTokenParsed?.preferred_username)
        setUserEmail(keycloak.idTokenParsed?.email)

        const realmRoles = keycloak.realmAccess?.roles || [];
        setRoles(realmRoles);
    };

    keycloak.onAuthLogout = () => {
        removeAccessTokenFromAuthHeader();
    };

    keycloak.onAuthError = () => {
        removeAccessTokenFromAuthHeader();
    };

    keycloak.onTokenExpired = () => {
        keycloak.updateToken(-1).then(function () {
            addAccessTokenToAuthHeader(keycloak.token);
            setUserId(keycloak.idTokenParsed?.sub);
            setUserName(keycloak.idTokenParsed?.name)
            setUserUserName(keycloak.idTokenParsed?.preferred_username)
            setUserEmail(keycloak.idTokenParsed?.email)
        });
    };

    function login() {
        keycloak.login();
    }

    function logout() {
        const logoutOptions = {redirectUri: import.meta.env.VITE_REACT_APP_URL};
        keycloak.logout(logoutOptions);
    }

    function isAuthenticated() {
        if (keycloak.token) return !isExpired(keycloak.token);
        else return false;
    }

    function hasRole(roleName: string): boolean {
        return roles.includes(roleName);
    }

    return (
        <SecurityContext.Provider
            value={{
                isAuthenticated,
                userId,
                userEmail,
                userName,
                userUsername,
                login,
                logout,
                loading,
                roles,
                hasRole
            }}
        >
            {children}
        </SecurityContext.Provider>
    );
}