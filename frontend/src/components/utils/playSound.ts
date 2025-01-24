import sanitizeFileName from "./sanitizeFileName.ts";

export const playSound = (
    gimmickName: string,
    setPlayingSound: (sound: string | null) => void,
    playingSound: string | null
) => {
    if (playingSound) {
        return;
    }

    const sanitizedFileName = sanitizeFileName(gimmickName);
    const audio = new Audio(`/assets/profile/sounds/${sanitizedFileName}.mp3`);
    audio.volume = 0.05;

    setPlayingSound(gimmickName);

    audio.play().catch(error => {
        console.error(`Error playing sound: ${sanitizedFileName}`, error);
        alert('Failed to play sound. Please check if the file exists and is in a supported format.');
        setPlayingSound(null);
    });

    audio.onended = () => {
        setPlayingSound(null);
    };
};

export const playSoundBool = (
    gimmickName: string,
    setPlayingSound: (isPlaying: boolean) => void,
    playingSound: boolean,
    setShowDialog: (show: boolean) => void
) => {
    if (playingSound) {
        return;
    }

    const sanitizedFileName = sanitizeFileName(gimmickName);
    const audio = new Audio(`/assets/profile/sounds/${sanitizedFileName}.mp3`);
    audio.volume = 0.05;

    setPlayingSound(true);

    audio.play().catch(error => {
        if (error.name === 'NotAllowedError' || error.name === 'NotSupportedError') {
            console.warn(`Playback prevented: ${sanitizedFileName}`, error);
            setShowDialog(true);
        } else {
            console.error(`Error playing sound: ${sanitizedFileName}`, error);
            alert('Failed to play sound. Please check if the file exists and is in a supported format.');
        }
        setPlayingSound(false);
    });

    audio.onended = () => {
        setPlayingSound(false);
    };
};