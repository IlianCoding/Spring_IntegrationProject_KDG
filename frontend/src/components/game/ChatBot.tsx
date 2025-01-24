import {
    Avatar,
    Box,
    ButtonBase,
    Chip,
    Divider,
    Drawer,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from 'react-i18next';
import '../../app.css';
import {useGetProfile} from "../../hooks/useProfile.ts";
import SecurityContext from "../../contexts/SecurityContext.ts";
import {useGetPopularQuestions, useSendMessageToChatbot} from "../../hooks/useChatbot.ts";
import {AiMessage} from "../../model/game/AI/AiMessage.ts";

function ChatBot() {
    const {t} = useTranslation();
    const {userId} = useContext(SecurityContext)
    const profileId = userId || '';
    const {data} = useGetProfile(profileId)
    const userName = data?.userName || "";
    const imgUrl = data?.avatarUrl || "";
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ sender: string, text: string }[]>(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [isThinking, setIsThinking] = useState(false);
    const scrollContainerRef = useRef<HTMLElement>(null);
    const {data: popularQuestions} = useGetPopularQuestions();
    const {mutate: sendChatMessage} = useSendMessageToChatbot();
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

    useEffect(() => {
        if (popularQuestions) {
            setSuggestedQuestions(popularQuestions.map((question: string) => question));
        }
    }, [popularQuestions]);

    const [isHovered, setIsHovered] = useState(false);
    const toggleDrawer = (open: boolean) => () => {
        setIsDrawerOpen(open);
    };

    const handleSendMessage = (msg: string = message) => {
        if (msg.trim()) {
            const newHistory = [...chatHistory, {sender: userName, text: msg}];
            setChatHistory(newHistory);
            localStorage.setItem('chatHistory', JSON.stringify(newHistory));
            setMessage('');
            setSuggestedQuestions(suggestedQuestions.filter(question => question !== msg));
            const aiMessage: AiMessage = {message: msg};
            setIsThinking(true);
            sendChatMessage(aiMessage, {
                onSuccess: (response) => {
                    setIsThinking(false);
                    const updatedHistory = [...newHistory, {sender: 'ChatBot', text: response.response}];
                    setChatHistory(updatedHistory);
                    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
                },
                onError: (error) => {
                    setIsThinking(false);
                    console.error('Error sending message to chatbot:', error);
                }
            });
        }
    };

    const handleClearChat = () => {
        setChatHistory([]);
        localStorage.removeItem('chatHistory');
    };

    useEffect(() => {
        if (isDrawerOpen) {
            const timeoutId = setTimeout(() => {
                const scrollContainer = scrollContainerRef.current;
                if (scrollContainer) {
                    const handleWheel = (event: WheelEvent) => {
                        if (event.deltaY !== 0) {
                            event.preventDefault();
                            scrollContainer.scrollLeft += event.deltaY;
                        }
                    };
                    scrollContainer.addEventListener('wheel', handleWheel);
                    return () => {
                        scrollContainer.removeEventListener('wheel', handleWheel);
                    };
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [isDrawerOpen]);

    return (
        <Box>
            <Tooltip title={t("Need help? Click to ask our chatbot a question")}>
                <ButtonBase
                    onClick={toggleDrawer(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    sx={{
                        width: {xs: 90, sm: 120, md: 150, lg: 180},
                        height: {xs: 112, sm: 150, md: 187, lg: 224},
                        position: 'absolute',
                        top: 50,
                        right: 10,
                        zIndex: 1000
                    }}
                >
                    <img src={isHovered ? "/assets/chatbot-hover.png" : "/assets/chatbot.png"} alt="ChatBot"
                         style={{width: '100%', height: '100%'}}/>
                </ButtonBase>
            </Tooltip>
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{
                        width: 600,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                        backgroundSize: 'cover',
                        fontFamily: 'MedievalSharp, cursive',
                        fontSize: '2.2rem',
                        color: '#4B0082',
                        position: 'relative'
                    }}
                    role="presentation"
                >
                    <Tooltip title={t("Clear chat")}>
                        <Fab
                            color="primary"
                            size="small"
                            onClick={handleClearChat}
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 1001
                            }}
                        >
                            <DeleteIcon/>
                        </Fab>
                    </Tooltip>
                    <Typography variant="h6" sx={{mb: 2, textAlign: 'center', color: '#4B0082'}}>
                        {t("ChatBot Assistance")}
                    </Typography>
                    <Divider/>
                    <List sx={{flexGrow: 1, overflow: 'auto'}}>
                        {chatHistory.map((msg, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                                    backgroundSize: 'cover',
                                    width: 'fit-content',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    border: '2px solid #8B4513',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: msg.sender === 'ChatBot' ? 'flex-start' : 'flex-end',
                                    marginLeft: msg.sender === 'ChatBot' ? '80px' : '0'
                                }}
                            >
                                <Avatar src={msg.sender === 'ChatBot' ? "/assets/chatbot-hover.png" : imgUrl}
                                        alt={msg.sender} sx={{marginRight: '10px'}}/>
                                <ListItemText
                                    primary={msg.text}
                                    sx={{
                                        fontFamily: 'MedievalSharp, cursive',
                                        fontSize: '1.5rem',
                                        color: '#4B0082',
                                        textShadow: '1px 2px 2px rgba(0, 0, 0, 0.4)'
                                    }}
                                />
                            </ListItem>
                        ))}
                        {isThinking && (
                            <ListItem
                                sx={{
                                    backgroundImage: 'url("https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?t=st=1734941126~exp=1734944726~hmac=5ec16ce1beee4e0fb50a47948617b7327c054e72de79f6a07d167642eeb123d3&w=1380")',
                                    backgroundSize: 'cover',
                                    width: 'fit-content',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    border: '2px solid #8B4513',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    marginLeft: '80px'
                                }}
                            >
                                <Avatar src="/assets/chatbot-hover.png" alt="ChatBot" sx={{marginRight: '10px'}}/>
                                <ListItemText
                                    primary={<span className="ellipsis"></span>}
                                    sx={{
                                        fontFamily: 'MedievalSharp, cursive',
                                        fontSize: '1.5rem',
                                        color: '#4B0082',
                                        textShadow: '1px 2px 2px rgba(0, 0, 0, 0.4)'
                                    }}
                                />
                            </ListItem>
                        )}
                    </List>
                    <Box ref={scrollContainerRef}
                         sx={{
                             display: 'flex',
                             overflowX: 'auto',
                             marginY: 2,
                             whiteSpace: 'nowrap',
                             minHeight: '50px',
                             maxHeight: '100px',
                         }}>
                        {suggestedQuestions.map((question, index) => (
                            <Chip
                                key={index}
                                label={question}
                                onClick={() => handleSendMessage(question)}
                                sx={{
                                    mr: 1,
                                    paddingY: 1,
                                    fontFamily: 'MedievalSharp, cursive',
                                    fontSize: '1rem',
                                    color: '#4B0082',
                                    borderColor: '#4B0082',
                                    '&:hover': {
                                        backgroundColor: '#4B0082',
                                        color: 'white'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder={t("Type a message")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            sx={{
                                fontFamily: 'MedievalSharp, cursive',
                                fontSize: '1.5rem',
                                color: '#4B0082',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
                            }}
                        />
                        <IconButton onClick={() => handleSendMessage()}>
                            <SendIcon/>
                        </IconButton>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
}

export default ChatBot;