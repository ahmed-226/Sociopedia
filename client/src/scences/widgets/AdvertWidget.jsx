import { Typography, useTheme, Box, Fade, IconButton } from "@mui/material"
import { ChevronLeft, ChevronRight, Pause, PlayArrow } from "@mui/icons-material"
import FlexBetween from "../../components/FlexBetween"
import WidgetWrapper from "../../components/WidgetWrapper"
import allowOrigins from "../../allowOrigins"
import { useState, useEffect } from "react"

const AdvertWidget = () => {
    const { palette } = useTheme()
    const dark = palette.neutral.dark
    const main = palette.neutral.main
    const medium = palette.neutral.medium
    
    const [advertisements, setAdvertisements] = useState([])
    const [currentAdIndex, setCurrentAdIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [fadeIn, setFadeIn] = useState(true)
    const [loading, setLoading] = useState(true)
    
    const currentAd = advertisements[currentAdIndex]
    
    // Fetch advertisements from API
    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                const response = await fetch(`${allowOrigins}/advertisements`)
                if (response.ok) {
                    const ads = await response.json()
                    setAdvertisements(ads)
                } else {
                    console.error('Failed to fetch advertisements')
                }
            } catch (error) {
                console.error('Error fetching advertisements:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchAdvertisements()
    }, [])
    
    // Auto-rotation effect
    useEffect(() => {
        if (!isPlaying || advertisements.length === 0) return
        
        const interval = setInterval(() => {
            setFadeIn(false)
            
            setTimeout(() => {
                setCurrentAdIndex((prevIndex) => 
                    (prevIndex + 1) % advertisements.length
                )
                setFadeIn(true)
            }, 300) // Half of transition duration
            
        }, 5000) // Change ad every 5 seconds
        
        return () => clearInterval(interval)
    }, [isPlaying, advertisements.length])
    
    const handlePrevious = () => {
        setFadeIn(false)
        setTimeout(() => {
            setCurrentAdIndex((prevIndex) => 
                prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1
            )
            setFadeIn(true)
        }, 300)
    }
    
    const handleNext = () => {
        setFadeIn(false)
        setTimeout(() => {
            setCurrentAdIndex((prevIndex) => 
                (prevIndex + 1) % advertisements.length
            )
            setFadeIn(true)
        }, 300)
    }
    
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }
    
    const handleAdClick = async () => {
        if (currentAd) {
            // Record click
            try {
                await fetch(`${allowOrigins}/advertisements/${currentAd._id}/click`, {
                    method: 'POST'
                })
            } catch (error) {
                console.error('Error recording ad click:', error)
            }
            
            // Open website
            window.open(`https://${currentAd.website}`, '_blank')
        }
    }
    
    if (loading) {
        return (
            <WidgetWrapper>
                <Typography>Loading advertisements...</Typography>
            </WidgetWrapper>
        )
    }
    
    if (!advertisements.length) {
        return (
            <WidgetWrapper>
                <Typography>No advertisements available</Typography>
            </WidgetWrapper>
        )
    }
    
    return (
        <WidgetWrapper 
            sx={{ 
                backgroundColor: currentAd?.backgroundColor || '#FFFFFF',
                transition: 'background-color 0.6s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Header with controls */}
            <FlexBetween mb="1rem">
                <Typography 
                    color={dark} 
                    variant="h5" 
                    fontWeight="500"
                    sx={{ color: currentAd?.textColor || dark }}
                >
                    Sponsored
                </Typography>
                <FlexBetween gap="0.5rem">
                    <IconButton 
                        size="small" 
                        onClick={togglePlayPause}
                        sx={{ color: currentAd?.textColor || dark }}
                    >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <Typography 
                        color={medium} 
                        sx={{ 
                            cursor: 'pointer',
                            color: currentAd?.textColor || dark,
                            opacity: 0.7,
                            '&:hover': { opacity: 1 }
                        }}
                        onClick={handleAdClick}
                    >
                        Create Ad
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            
            {/* Navigation controls */}
            {advertisements.length > 1 && (
                <FlexBetween 
                    sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: 0, 
                        right: 0, 
                        zIndex: 2,
                        pointerEvents: 'none'
                    }}
                >
                    <IconButton 
                        onClick={handlePrevious}
                        sx={{ 
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            ml: '0.5rem',
                            pointerEvents: 'auto',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' }
                        }}
                        size="small"
                    >
                        <ChevronLeft />
                    </IconButton>
                    <IconButton 
                        onClick={handleNext}
                        sx={{ 
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            mr: '0.5rem',
                            pointerEvents: 'auto',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' }
                        }}
                        size="small"
                    >
                        <ChevronRight />
                    </IconButton>
                </FlexBetween>
            )}
            
            {/* Ad content with fade transition */}
            <Fade in={fadeIn} timeout={600}>
                <Box>
                    <Box 
                        sx={{ 
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                transition: 'transform 0.3s ease'
                            }
                        }}
                        onClick={handleAdClick}
                    >
                        <img 
                            width="100%"
                            height="auto"
                            alt="advertisement"
                            src={`${allowOrigins}/assets/${currentAd?.image}`}
                            style={{
                                borderRadius: '0.75rem',
                                margin: "0.75rem 0",
                                maxHeight: '200px',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.src = `${allowOrigins}/assets/info4.jpeg`
                            }}
                        />
                        
                        {/* Overlay with company name */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '0.75rem',
                                left: '0.75rem',
                                right: '0.75rem',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <Typography variant="h6" fontWeight="600">
                                {currentAd?.company}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <FlexBetween>
                        <Typography 
                            color={main}
                            fontWeight="500"
                            sx={{ color: currentAd?.textColor || main }}
                        >
                            {currentAd?.company}
                        </Typography>
                        <Typography 
                            color={medium}
                            sx={{ 
                                color: currentAd?.textColor || medium,
                                opacity: 0.8,
                                cursor: 'pointer',
                                '&:hover': { 
                                    opacity: 1,
                                    textDecoration: 'underline'
                                }
                            }}
                            onClick={handleAdClick}
                        >
                            {currentAd?.website}
                        </Typography>
                    </FlexBetween>
                    
                    <Typography 
                        color={medium} 
                        m="0.5rem 0"
                        sx={{ 
                            color: currentAd?.textColor || medium,
                            opacity: 0.9,
                            fontSize: '0.9rem',
                            lineHeight: 1.4
                        }}
                    >
                        {currentAd?.description}
                    </Typography>
                    
                    {/* Progress indicator */}
                    {advertisements.length > 1 && (
                        <FlexBetween mt="1rem">
                            <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                                {advertisements.map((_, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: index === currentAdIndex 
                                                ? currentAd?.textColor || main
                                                : 'rgba(0,0,0,0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => {
                                            setFadeIn(false)
                                            setTimeout(() => {
                                                setCurrentAdIndex(index)
                                                setFadeIn(true)
                                            }, 300)
                                        }}
                                    />
                                ))}
                            </Box>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: currentAd?.textColor || main,
                                    opacity: 0.6 
                                }}
                            >
                                {currentAdIndex + 1} of {advertisements.length}
                            </Typography>
                        </FlexBetween>
                    )}
                </Box>
            </Fade>
        </WidgetWrapper>
    )
}

export default AdvertWidget