import {styled} from "@mui/system";
import {TableCell, TableRow} from "@mui/material";
import {TFunction} from 'i18next';


export const getTabLabel = (tabIndex: number, t: TFunction) => {
    switch (tabIndex) {
        case 0:
            return t('Global leaderboard');
        case 1:
            return t('Friend leaderboard');
        case 2:
            return t('Personal leaderboard');
        default:
            return t('Leaderboard');
    }
};

export const StyledTableCell = styled(TableCell)(() => ({
    '&&': {
        fontFamily: 'MedievalSharp, cursive',
        color: '#4B0082',
        border: '2px solid #3A0066',
        fontSize: '1.4em',
        padding: '16px',
    }
}));


export const CenteredSmallTableCell = styled(StyledTableCell)(() => ({
    '&&': {
        textAlign: 'center',
        width: '80px',
    }
}));

export const CenteredTableCell = styled(StyledTableCell)(() => ({
    '&&': {
        textAlign: 'center',
    }
}));

export const StyledTableRow = styled(TableRow)(() => ({
    '&&': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: '70px',
    }
}));

export const StyledHeaderRow = styled(TableRow)(() => ({
    '&&': {
        backgroundImage: 'url(\'https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380\')',
        height: '70px',
    }
}));