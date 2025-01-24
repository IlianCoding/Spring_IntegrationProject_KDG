import React, {useContext, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityContext from '../../contexts/SecurityContext.ts';
import {useUpdateLocale} from '../../hooks/useProfile.ts';
import {useTranslation} from 'react-i18next';
import FlagIcon from '@mui/icons-material/Flag';

function Navbar() {
    const {logout, isAuthenticated, login, userId, hasRole} = useContext(SecurityContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
    const {i18n, t} = useTranslation();
    const {mutate: updateLocale} = useUpdateLocale();
    const location = useLocation();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    const handleLanguageChange = (newLanguage: string) => {
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('locale', newLanguage);
        const profileId = userId || '';
        if (isAuthenticated()) {
            updateLocale({profileId, localeString: newLanguage});
        }
        handleLanguageMenuClose();
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <AppBar position="static" sx={{marginBottom: 2}}>
            <Toolbar>
                <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'space between'}}>
                    {location.pathname !== '/' && (
                        <Link to="/" style={{textDecoration: 'none'}}>
                            <Typography variant="h4" sx={{color: 'white'}}>
                                Machiavelli
                            </Typography>
                        </Link>
                    )}
                </Box>
                <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>
                    <Tooltip title={t('Language')}>
                        <IconButton onClick={handleLanguageMenuOpen} sx={{mr: 2}}>
                            <FlagIcon sx={{color: 'white'}}/>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={languageAnchorEl}
                        open={Boolean(languageAnchorEl)}
                        onClose={handleLanguageMenuClose}
                    >
                        <MenuItem onClick={() => handleLanguageChange('en')}>
                            <img src="/assets/language/uk.png" alt="English"
                                 style={{marginRight: 8, width: 24, height: 16}}/>
                            {t('English')}
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageChange('be')}>
                            <img src="/assets/language/be.png" alt="Dutch"
                                 style={{marginRight: 8, width: 24, height: 16}}/>
                            {t('Dutch')}
                        </MenuItem>
                    </Menu>
                    {isAuthenticated() && (
                        <>
                            {location.pathname !== '/shop' && (
                                <Button variant="contained" color="primary" component={Link} to="/shop" sx={{mr: 2}}>
                                    <i className="fi fi-ss-sword" style={{marginRight: 8}}></i>
                                    {t('Shop')}
                                </Button>
                            )}
                            {hasRole('admin') && location.pathname !== '/admin' && (
                                <Button variant="contained" color="primary" component={Link} to="/admin"
                                        sx={{mr: 2}}>
                                    <i className="fi fi-ss-crown" style={{marginRight: 8}}></i>
                                    {t('Admin Dashboard')}
                                </Button>
                            )}
                        </>
                    )}
                    {location.pathname !== '/' && (
                        <Button variant="contained" color="primary" component={Link} to="/" sx={{mr: 2}}>
                            <i className="fi fi-ss-castle" style={{marginRight: 8}}></i>
                            {t('Home')}
                        </Button>
                    )}
                    {isAuthenticated() ? (
                        <>
                            {location.pathname !== '/profile' && (
                                <Button variant="contained" color="primary" component={Link} to="/profile" sx={{mr: 2}}>
                                    <i className="fi fi-ss-helmet-battle" style={{marginRight: 8}}></i>
                                    {t('Profile')}
                                </Button>
                            )}
                            <Button onClick={handleLogout}>
                                {t('Logout')}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={login}>
                            {t('Login or Register')}
                        </Button>
                    )}
                </Box>
                <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {location.pathname !== '/' && (
                            <MenuItem key="home" onClick={handleMenuClose} component={Link} to="/">
                                <i className="fi fi-ss-castle" style={{marginRight: 8}}></i>
                                {t('Home')}
                            </MenuItem>
                        )}
                        {isAuthenticated() && location.pathname !== '/shop' && (
                            <MenuItem key="shop" onClick={handleMenuClose} component={Link} to="/shop">
                                <i className="fi fi-ss-sword" style={{marginRight: 8}}></i>
                                {t('Shop')}
                            </MenuItem>
                        )}
                        {isAuthenticated() ? (
                            [
                                location.pathname !== '/profile' && (
                                    <MenuItem key="profile" onClick={handleMenuClose} component={Link} to="/profile">
                                        <i className="fi fi-ss-helmet-battle" style={{marginRight: 8}}></i>
                                        {t('Profile')}
                                    </MenuItem>
                                ),
                                hasRole('admin') && location.pathname !== '/admindashboard' && (
                                    <MenuItem key="admindashboard" onClick={handleMenuClose} component={Link}
                                              to="/admindashboard">
                                        <i className="fi fi-ss-crown" style={{marginRight: 8}}></i>
                                        {t('Admin Dashboard')}
                                    </MenuItem>
                                ),
                                <MenuItem key="logout" onClick={() => {
                                    handleMenuClose();
                                    handleLogout();
                                }}>
                                    {t('Logout')}
                                </MenuItem>
                            ]
                        ) : (
                            <MenuItem key="login" onClick={() => {
                                handleMenuClose();
                                login();
                            }}>
                                {t('Login or Register')}
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;