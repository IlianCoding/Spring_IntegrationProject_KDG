import {Box, Tooltip} from "@mui/material";
import AnimatedButton from "../../../utils/animatedButton.tsx";
import SaveIcon from "@mui/icons-material/Save";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import {useTranslation} from 'react-i18next';

interface ActionButtonsProps {
    onCancel: () => void;
}

function ActionButtons({onCancel}: ActionButtonsProps) {
    const {t} = useTranslation();

    return (
        <Box display="flex" mt={2} gap={2}>
            <Tooltip title={t("Save")}>
                <AnimatedButton
                    aria-label={t("Save")}
                    type="submit"
                    animationType="save"
                    animationDuration={0.2}
                    color="success"
                >
                    <SaveIcon/>
                </AnimatedButton>
            </Tooltip>
            <Tooltip title={t("Cancel")}>
                <AnimatedButton aria-label={t("Cancel")} onClickAction={onCancel} animationType="cancel"
                                animationDuration={0.5} color="error">
                    <DescriptionIcon/>
                    <DeleteIcon/>
                </AnimatedButton>
            </Tooltip>
        </Box>
    );
}

export default ActionButtons;