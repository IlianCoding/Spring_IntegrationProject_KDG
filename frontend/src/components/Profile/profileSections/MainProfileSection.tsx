import {Avatar, Box, Tooltip, Typography} from '@mui/material';
import CakeSharpIcon from '@mui/icons-material/CakeSharp';
import NotificationButton from './NotificationButton.tsx';
import {Profile} from '../../../model/profile/Profile.ts';
import {Friend} from "../../../model/profile/Friend.ts";
import EditProfileSection from './EditProfileSection/EditProfileSection.tsx';
import {useUpdateProfile} from '../../../hooks/useProfile.ts';
import EditIcon from '@mui/icons-material/Edit';
import AnimatedButton from '../../utils/animatedButton.tsx';
import {useTranslation} from "react-i18next";

interface MainProfileSectionProps {
    profile: Profile | Friend;
    isEditing?: boolean;
    setIsEditing?: (isEditing: boolean) => void;
}

function MainProfileSection({profile, isEditing = false, setIsEditing}: MainProfileSectionProps) {
    const {t} = useTranslation();
    const {mutate: updateProfile} = useUpdateProfile();

    function isFriend(profile: Profile | Friend): profile is Friend {
        return !('channel' in profile);
    }

    const onSave = (updatedProfile: Partial<Profile>) => {
        const completeProfile = {...profile, ...updatedProfile};

        const isProfileChanged = Object.keys(updatedProfile).some(
            key => {
                if (key in profile) {
                    if ((profile as Profile)[key as keyof Profile] !== undefined) {
                        return updatedProfile[key as keyof Profile] !== (profile as Profile)[key as keyof Profile];
                    }
                }
                return false;
            }
        );

        if (isProfileChanged) {
            updateProfile(completeProfile as Profile);
        }

        if (setIsEditing) {
            setIsEditing(false);
        }
    };
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} width="100%"
             className="main-profile-section" sx={{position: 'relative'}}>
            {isEditing && (
                <EditProfileSection
                    profile={profile as Profile}
                    onSave={(updatedProfile) => {
                        onSave(updatedProfile);
                        if (setIsEditing) {
                            setIsEditing(false);
                        }
                    }}
                    onCancel={() => setIsEditing && setIsEditing(false)}
                />
            )}

            {!isEditing && (
                <>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            sx={{width: 100, height: 100}}
                            src={profile.avatarUrl}
                        />
                        <Box ml={2}>
                            <Typography variant="h4">{profile.name}</Typography>
                            <Typography>{profile.userName}</Typography>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body2" sx={{mr: 1}}><CakeSharpIcon/></Typography>
                                <Typography
                                    variant="body2">{new Date(profile.birthday).toLocaleDateString()}</Typography>
                            </Box>
                            <Typography variant="body2">{profile.subText}</Typography>
                        </Box>
                    </Box>
                    {'channel' in profile && (
                        <Box sx={{position: 'absolute', top: 0, right: 0}}>
                            <NotificationButton channel={profile.channel}/>
                        </Box>
                    )}
                    {!isFriend(profile) && (
                        <Tooltip title={t("Edit Profile")}>
                            <AnimatedButton
                                aria-label={t("Edit")}
                                onClickAction={() => setIsEditing && setIsEditing(true)}>
                                <EditIcon/>
                            </AnimatedButton>
                        </Tooltip>
                    )}
                </>
            )}
        </Box>
    );
}

export default MainProfileSection;