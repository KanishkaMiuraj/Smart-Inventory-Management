import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, CardActionArea } from '@mui/material';
import { CheckCircle, Visibility } from '@mui/icons-material';
import { keyframes } from '@mui/system';

// --- 1. Define Pulse Animation ---
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const StatCard = ({ title, value, icon, gradient, onClick, isAlert }) => {
    
    // Logic: Is this the "Good" state? (Alert card but value is 0)
    const isAllGood = isAlert && value === 0;

    // --- 2. Dynamic Styles ---
    const activeGradient = isAllGood 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // Green for Good
        : gradient; // Normal or Red for Bad

    // If all good, force the CheckCircle icon, otherwise use the passed icon
    const activeIcon = isAllGood ? <CheckCircle /> : icon;

    // Only animate if it is an Alert Card AND items are > 0
    const animationStyle = (isAlert && !isAllGood) 
        ? { animation: `${pulse} 2s infinite` } 
        : {};

    return (
        <Card sx={{ 
            height: '100%', 
            background: activeGradient, 
            color: 'white', 
            position: 'relative', 
            overflow: 'hidden', 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            cursor: onClick ? 'pointer' : 'default',
            ...animationStyle // Apply animation logic
        }}>
            <CardActionArea 
                onClick={onClick} 
                disabled={!onClick} 
                sx={{ height: '100%', p: 2 }}
            >
                {/* Background Decor Icon */}
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.2, transform: 'rotate(30deg)' }}>
                    {React.cloneElement(activeIcon, { sx: { fontSize: 100 } })}
                </Box>
                
                <CardContent sx={{ p: '0 !important' }}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, borderRadius: 2 }}>
                            {activeIcon}
                        </Avatar>
                        <Typography variant="body2" fontWeight="600" sx={{ opacity: 0.9 }}>
                            {title}
                        </Typography>
                    </Box>
                    
                    <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px', my: 1 }}>
                        {/* If All Good, Show "All Good!", else show Number */}
                        {isAllGood ? "All Good!" : value}
                    </Typography>

                    {/* CLICK HINT: Only show if clickable */}
                    {onClick && (
                        <Box display="flex" alignItems="center" mt={1} sx={{ opacity: 0.8 }}>
                            <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption" fontWeight="bold">
                                {isAllGood ? "Inventory Healthy" : "Click to view items"}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default StatCard;