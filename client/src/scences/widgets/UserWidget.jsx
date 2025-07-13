import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state";
import allowOrigins from "../../allowOrigins";

const UserWidget = ({ userId, PicturePath }) => {
    const [user, setUser] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [socialDialogOpen, setSocialDialogOpen] = useState(false);
    const [editingField, setEditingField] = useState('');
    const [editValue, setEditValue] = useState('');
    const [socialPlatform, setSocialPlatform] = useState('');
    const [socialUrl, setSocialUrl] = useState('');
    
    const { palette } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUser = useSelector((state) => state.user);
    
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const isOwnProfile = loggedInUser._id === userId;

    const getUser = async () => {
        try {
            const response = await fetch(`${allowOrigins}/users/${userId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                console.error('Failed to fetch user:', response.status);
                return;
            }
            
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleEditClick = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);
        setEditDialogOpen(true);
    };

    const handleSocialEditClick = (platform) => {
        setSocialPlatform(platform);
        setSocialUrl(user.socialProfiles?.[platform] || '');
        setSocialDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`${allowOrigins}/users/${userId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [editingField]: editValue
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                
                
                if (isOwnProfile) {
                    dispatch(setLogin({
                        user: updatedUser,
                        token: token
                    }));
                }
                
                setEditDialogOpen(false);
                setEditingField('');
                setEditValue('');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update profile');
        }
    };

const handleSaveSocialProfile = async () => {
    try {
        console.log('Saving social profile:', { socialPlatform, socialUrl }); 
        
        const socialProfiles = {
            ...user.socialProfiles,
            [socialPlatform]: socialUrl
        };

        console.log('Social profiles object:', socialProfiles); 

        const response = await fetch(`${allowOrigins}/users/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                socialProfiles: socialProfiles
            }),
        });

        console.log('Response status:', response.status); 

        if (response.ok) {
            const updatedUser = await response.json();
            console.log('Updated user:', updatedUser); 
            setUser(updatedUser);
            
            
            if (isOwnProfile) {
                dispatch(setLogin({
                    user: updatedUser,
                    token: token
                }));
            }
            
            setSocialDialogOpen(false);
            setSocialPlatform('');
            setSocialUrl('');
        } else {
            const errorData = await response.text(); 
            console.error('Failed to update social profile:', response.status, errorData);
            alert(`Failed to update social profile: ${errorData}`);
        }
    } catch (error) {
        console.error('Error updating social profile:', error);
        alert(`Failed to update social profile: ${error.message}`);
    }
};
    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return null;
    }
    
    const {
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends,
        socialProfiles = {}
    } = user;
    
    return (
        <>
            <WidgetWrapper>
                <FlexBetween
                    gap="0.5rem"
                    pb="1.1rem"
                    onClick={() => navigate(`/profile/${userId}`)}
                >
                    <FlexBetween gap="1rem">
                        <UserImage image={PicturePath}/>
                        <Box>
                            <Typography
                                variant="h4"
                                color={dark}
                                fontWeight="500"
                                sx={{
                                    "&:hover": {
                                        color: palette.primary.light,
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                {firstName} {lastName}
                            </Typography>
                            <Typography color={medium}>{friends.length} friends</Typography>
                        </Box>
                    </FlexBetween>
                    {isOwnProfile && (
                        <ManageAccountsOutlined 
                            sx={{ 
                                cursor: "pointer",
                                "&:hover": { color: palette.primary.main }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('Profile management coming soon!');
                            }}
                        />
                    )}
                </FlexBetween>

                <Divider />

                <Box p="1rem 0">
                    <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                        <LocationOnOutlined fontSize="large" sx={{ color: main }} />
                        <Typography color={medium} sx={{ flex: 1 }}>
                            {location || 'No location set'}
                        </Typography>
                        {isOwnProfile && (
                            <EditOutlined 
                                sx={{ 
                                    cursor: "pointer", 
                                    fontSize: "1rem",
                                    "&:hover": { color: palette.primary.main }
                                }}
                                onClick={() => handleEditClick('location', location || '')}
                            />
                        )}
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                        <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                        <Typography color={medium} sx={{ flex: 1 }}>
                            {occupation || 'No occupation set'}
                        </Typography>
                        {isOwnProfile && (
                            <EditOutlined 
                                sx={{ 
                                    cursor: "pointer", 
                                    fontSize: "1rem",
                                    "&:hover": { color: palette.primary.main }
                                }}
                                onClick={() => handleEditClick('occupation', occupation || '')}
                            />
                        )}
                    </Box>
                </Box>

                <Divider />

                <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Who's viewed your profile</Typography>
                        <Typography color={main}>{viewedProfile}</Typography>
                    </FlexBetween>
                    <FlexBetween>
                        <Typography color={medium}>Impressions of your posts</Typography>
                        <Typography color={main} fontWeight="500">
                            {impressions}
                        </Typography>
                    </FlexBetween>
                </Box>

                <Divider />

                <Box p="1rem 0">
                    <Typography
                        fontSize="1rem"
                        color={main}
                        fontWeight="500"
                        mb="1rem"
                    >
                        Social Profiles
                    </Typography>

                    <FlexBetween gap="1rem" mb="0.5rem">
                        <FlexBetween gap="1rem">
                            <img src="../assets/twitter.png" alt="twitter" style={{ width: '30px', height: '30px' }} />
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    Twitter
                                </Typography>
                                <Typography color={medium}>
                                    {socialProfiles.twitter ? (
                                        <a href={socialProfiles.twitter} target="_blank" rel="noopener noreferrer" style={{ color: palette.primary.main }}>
                                            View Profile
                                        </a>
                                    ) : (
                                        'Not connected'
                                    )}
                                </Typography>
                            </Box>
                        </FlexBetween>
                        {isOwnProfile && (
                            <EditOutlined 
                                sx={{ 
                                    color: main, 
                                    cursor: "pointer",
                                    "&:hover": { color: palette.primary.main }
                                }}
                                onClick={() => handleSocialEditClick('twitter')}
                            />
                        )}
                    </FlexBetween>

                    <FlexBetween gap="1rem" mb="0.5rem">
                        <FlexBetween gap="1rem">
                            <img src="../assets/linkedin.png" alt="linkedin" style={{ width: '30px', height: '30px' }} />
                            <Box>
                                <Typography color={main} fontWeight="500">
                                    LinkedIn
                                </Typography>
                                <Typography color={medium}>
                                    {socialProfiles.linkedin ? (
                                        <a href={socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: palette.primary.main }}>
                                            View Profile
                                        </a>
                                    ) : (
                                        'Not connected'
                                    )}
                                </Typography>
                            </Box>
                        </FlexBetween>
                        {isOwnProfile && (
                            <EditOutlined 
                                sx={{ 
                                    color: main, 
                                    cursor: "pointer",
                                    "&:hover": { color: palette.primary.main }
                                }}
                                onClick={() => handleSocialEditClick('linkedin')}
                            />
                        )}
                    </FlexBetween>
                </Box>
            </WidgetWrapper>

            {/* Basic Profile Edit Dialog */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        width: '500px',
                        maxWidth: '90vw'
                    }
                }}
            >
                <DialogTitle>Edit {editingField}</DialogTitle>
                <DialogContent sx={{ minHeight: '120px' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={editingField.charAt(0).toUpperCase() + editingField.slice(1)}
                        fullWidth
                        variant="outlined"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditDialogOpen(false)} size="large">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} variant="contained" size="large">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Social Profile Edit Dialog */}
            <Dialog 
                open={socialDialogOpen} 
                onClose={() => setSocialDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        width: '600px',
                        maxWidth: '90vw'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <img 
                            src={`../assets/${socialPlatform}.png`} 
                            alt={socialPlatform} 
                            style={{ width: '32px', height: '32px' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <Typography variant="h6">
                            Edit {socialPlatform?.charAt(0).toUpperCase() + socialPlatform?.slice(1)} Profile
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ minHeight: '160px' }}>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        Enter the full URL to your {socialPlatform} profile
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={`${socialPlatform?.charAt(0).toUpperCase() + socialPlatform?.slice(1)} URL`}
                        fullWidth
                        variant="outlined"
                        value={socialUrl}
                        onChange={(e) => setSocialUrl(e.target.value)}
                        placeholder={`https://${socialPlatform}.com/yourprofile`}
                        helperText={`Example: https://${socialPlatform}.com/yourprofile`}
                        sx={{ mt: 1 }}
                        multiline={false}
                        InputProps={{
                            sx: {
                                fontSize: '1rem',
                                minHeight: '56px'
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setSocialDialogOpen(false)} 
                        size="large"
                        sx={{ minWidth: '100px' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSaveSocialProfile} 
                        variant="contained" 
                        size="large"
                        sx={{ minWidth: '100px' }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserWidget;